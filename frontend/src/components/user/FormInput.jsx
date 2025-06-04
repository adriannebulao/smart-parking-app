function FormInput({ id, label, value, onChange, type = "text", ...props }) {
  return (
    <div>
      <label className="block font-medium mb-1" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        className="w-full border rounded px-3 py-2"
        {...props}
      />
    </div>
  );
}

export default FormInput;
