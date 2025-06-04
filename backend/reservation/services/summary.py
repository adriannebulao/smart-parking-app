from datetime import timedelta

from django.db.models import Count
from django.db.models.functions import (
    TruncDay, TruncWeek, TruncMonth, TruncYear,
    ExtractYear, ExtractMonth, ExtractWeek, ExtractDay
)
from django.utils.dateparse import parse_date
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError

def summary_today(queryset, today):
    """
    Returns the total number of reservations for today.
    """
    count = queryset.filter(start_time__date=today).count()
    return Response({
        "summary_type": "today",
        "date": today.isoformat(),
        "total_reservations": count
    }, status=status.HTTP_200_OK)

def summary_total(queryset, year, month, week, day, start_date, end_date, has_explicit):
    """
    Returns the total number of reservations for the given filters.
    """
    count = queryset.count()
    response = {
        "summary_type": "total",
        "total_reservations": count
    }
    return _add_metadata_to_response(
        response,
        year=year, month=month, week=week, day=day,
        start_date=start_date, end_date=end_date,
        has_explicit=has_explicit
    )

def summary_grouped(queryset, group_by, sort_order, year, month, week, day, start_date, end_date, has_explicit):
    """
    Returns grouped reservation counts by the specified period (day, week, month, year).
    """
    trunc_map = {
        'day': (TruncDay('start_time'), '%Y-%m-%d'),
        'week': (TruncWeek('start_time'), '%Y-W%U'),
        'month': (TruncMonth('start_time'), '%Y-%m'),
        'year': (TruncYear('start_time'), '%Y'),
    }

    trunc_func, fmt = trunc_map[group_by]

    # Annotate and group reservations by the selected period
    grouped = (
        queryset
        .annotate(period=trunc_func)
        .values('period')
        .annotate(total_reservations=Count('id'))
    )

    # Sort grouped data by reservation count
    grouped = grouped.order_by('-total_reservations' if sort_order == 'desc' else 'total_reservations')

    data = [
        {'period': entry['period'].strftime(fmt), 'total_reservations': entry['total_reservations']}
        for entry in grouped
    ]

    response = {
        'summary_type': 'grouped',
        'group_by': group_by,
        'data': data
    }

    return _add_metadata_to_response(
        response,
        year=year, month=month, week=week, day=day,
        start_date=start_date, end_date=end_date,
        has_explicit=has_explicit
    )

def validate_summary_params(params):
    """
    Validates and extracts summary_type, group_by, and sort_order from query params.
    """
    summary_type = params.get('summary_type', 'today')
    if summary_type not in {'today', 'total', 'grouped'}:
        raise ValidationError("Invalid summary_type. Use 'today', 'total', or 'grouped'.")

    group_by = params.get('group_by', 'day').lower()
    if group_by not in {'day', 'week', 'month', 'year'}:
        raise ValidationError("Invalid group_by. Use 'day', 'week', 'month', or 'year'.")

    sort_order = params.get('sort', 'asc').lower()
    if sort_order not in {'asc', 'desc'}:
        raise ValidationError("Invalid sort order. Use 'asc' or 'desc'.")

    return summary_type, group_by, sort_order

def get_date_range(params, today):
    """
    Determines the start and end date for filtering based on query params.
    Supports explicit dates or relative ranges (week, month, year).
    """
    range_type = params.get('range')
    start_str = params.get('start_date')
    end_str = params.get('end_date')

    start_date = parse_date(start_str) if start_str else None
    end_date = parse_date(end_str) if end_str else today

    if not start_date and range_type:
        delta = {'week': 7, 'month': 30, 'year': 365}.get(range_type)
        if delta:
            start_date = today - timedelta(days=delta)

    if start_date and start_date > end_date:
        raise ValidationError("start_date cannot be after end_date.")

    return start_date, end_date

def get_time_filters(params):
    """
    Extracts year, month, week, and day filters from query params.
    """
    try:
        year = int(params.get('year')) if params.get('year') else None
        month = int(params.get('month')) if params.get('month') else None
        week = int(params.get('week')) if params.get('week') else None
        day = int(params.get('day')) if params.get('day') else None
    except ValueError:
        raise ValidationError("year, month, week, and day must be integers.")
    return year, month, week, day

def apply_time_filters(queryset, year, month, week, day):
    """
    Annotates and filters the queryset by year, month, week, and/or day if provided.
    """
    annotations = {}
    time_filters = {}

    if year:
        annotations['year_val'] = ExtractYear('start_time')
        time_filters['year_val'] = year
    if month:
        annotations['month_val'] = ExtractMonth('start_time')
        time_filters['month_val'] = month
    if week:
        annotations['week_val'] = ExtractWeek('start_time')
        time_filters['week_val'] = week
    if day:
        annotations['day_val'] = ExtractDay('start_time')
        time_filters['day_val'] = day

    if annotations:
        queryset = queryset.annotate(**annotations).filter(**time_filters)
    return queryset

def apply_date_range_filters(queryset, start_date, end_date):
    """
    Filters the queryset by start_date and end_date if provided.
    """
    if start_date:
        queryset = queryset.filter(start_time__date__gte=start_date)
    if end_date:
        queryset = queryset.filter(start_time__date__lte=end_date)
    return queryset

def _add_metadata_to_response(response, *, year=None, month=None, week=None, day=None, start_date=None, end_date=None, has_explicit=False):
    """
    Adds metadata (year, month, week, day, start_date, end_date) to the response if present.
    """
    for key, val in [('year', year), ('month', month), ('week', week), ('day', day)]:
        if val:
            response[key] = val
    if not has_explicit:
        if start_date:
            response['start_date'] = start_date.isoformat()
        if end_date:
            response['end_date'] = end_date.isoformat()
    return Response(response, status=status.HTTP_200_OK)