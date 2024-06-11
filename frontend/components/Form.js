// import React, { useEffect, useState } from 'react'
// import * as yup from "yup"

// // 👇 Here are the validation errors you will use with Yup.
// const validationErrors = {
//   fullNameTooShort: 'full name must be at least 3 characters',
//   fullNameTooLong: 'full name must be at most 20 characters',
//   sizeIncorrect: 'size must be S or M or L'
// }

// // 👇 Here you will create your schema.

// // 👇 This array could help you construct your checkboxes using .map in the JSX.
// const toppings = [
//   { topping_id: '1', text: 'Pepperoni' },
//   { topping_id: '2', text: 'Green Peppers' },
//   { topping_id: '3', text: 'Pineapple' },
//   { topping_id: '4', text: 'Mushrooms' },
//   { topping_id: '5', text: 'Ham' },
// ]

// export default function Form() {
//   return (
//     <form>
//       <h2>Order Your Pizza</h2>
//       {true && <div className='success'>Thank you for your order!</div>}
//       {true && <div className='failure'>Something went wrong</div>}

//       <div className="input-group">
//         <div>
//           <label htmlFor="fullName">Full Name</label><br />
//           <input placeholder="Type full name" id="fullName" type="text" />
//         </div>
//         {true && <div className='error'>Bad value</div>}
//       </div>

//       <div className="input-group">
//         <div>
//           <label htmlFor="size">Size</label><br />
//           <select id="size">
//             <option value="">----Choose Size----</option>
//             {/* Fill out the missing options */}
//           </select>
//         </div>
//         {true && <div className='error'>Bad value</div>}
//       </div>

//       <div className="input-group">
//         {/* 👇 Maybe you could generate the checkboxes dynamically */}
//         <label key="1">
//           <input
//             name="Pepperoni"
//             type="checkbox"
//           />
//           Pepperoni<br />
//         </label>
//       </div>
//       {/* 👇 Make sure the submit stays disabled until the form validates! */}
//       <input type="submit" />
//     </form>
//   )
// }
//CODE BELOW IS WIP
import React, { useState, useEffect } from 'react';
import * as yup from "yup";
import axios from 'axios';

const validationErrors = {
  fullNameTooShort: 'full name must be at least 3 characters',
  fullNameTooLong: 'full name must be at most 20 characters',
  sizeIncorrect: 'size must be S or M or L'
};

const toppings = [
  { topping_id: '1', text: 'Pepperoni' },
  { topping_id: '2', text: 'Green Peppers' },
  { topping_id: '3', text: 'Pineapple' },
  { topping_id: '4', text: 'Mushrooms' },
  { topping_id: '5', text: 'Ham' },
];

const formSchema = yup.object().shape({
  fullName: yup
    .string()
    .trim()
    .required(validationErrors.fullNameTooShort)
    .min(3, validationErrors.fullNameTooShort)
    .max(20, validationErrors.fullNameTooLong),
  size: yup
    .string()
    .trim()
    .required(validationErrors.sizeIncorrect)
    .oneOf(['S', 'M', 'L'], validationErrors.sizeIncorrect)
});

const getInitialValues = () => ({
  fullName: '',
  size: '',
  toppings: [],
});

const getInitialErrors = () => ({
  fullName: '',
  size: ''
});

export default function Form() {
  const [values, setValues] = useState(getInitialValues());
  const [errors, setErrors] = useState(getInitialErrors());
  const [serverSuccess, setServerSuccess] = useState('');
  const [serverFailure, setServerFailure] = useState('');
  const [formEnabled, setFormEnabled] = useState(false);

  useEffect(() => {
    formSchema.isValid(values).then(setFormEnabled);
  }, [values]);

  const onChange = (event) => {
    const { type, name, value, checked } = event.target;
    if (type === 'checkbox') {
      const newToppings = checked
        ? [...values.toppings, value]
        : values.toppings.filter((t) => t !== value);
      setValues((prevValues) => ({
        ...prevValues,
        toppings: newToppings,
      }));
    } else {
      setValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
      yup
        .reach(formSchema, name)
        .validate(value)
        .then(() => setErrors((prevErrors) => ({ ...prevErrors, [name]: '' })))
        .catch((err) => setErrors((prevErrors) => ({ ...prevErrors, [name]: err.errors[0] })));
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();
    axios
      .post('http://localhost:9009/api/order', values)
      .then((res) => {
        setValues(getInitialValues());
        setServerSuccess(res.data.message);
        setServerFailure();
      })
      .catch((err) => {
        setServerFailure(err.response.data.message);
        setServerSuccess();
      });
  };

  return (
    <form onSubmit={onSubmit}>
      <h2>Order Your Pizza</h2>
      {serverSuccess && <h4 className="success">{serverSuccess}</h4>}
      {serverFailure && <h4 className="failure">{serverFailure}</h4>}

      <div className="input-group">
        <label htmlFor="fullName">Full Name:</label>
        <input
          value={values.fullName}
          onChange={onChange}
          id="fullName"
          name="fullName"
          type="text"
          placeholder="Type full name"
        />
        {errors.fullName && <div className="validation">{errors.fullName}</div>}
      </div>

      <div className="input-group">
        <label htmlFor="size">Size:</label>
        <select value={values.size} onChange={onChange} id="size" name="size">
          <option value="">----Choose Size----</option>
          <option value="S">Small</option>
          <option value="M">Medium</option>
          <option value="L">Large</option>
        </select>
        {errors.size && <div className="validation">{errors.size}</div>}
      </div>

      <div className="input-group">
        <label>Toppings:</label>
        {toppings.map((topping) => (
          <label key={topping.topping_id}>
            <input
              name="toppings"
              type="checkbox"
              value={topping.topping_id}
              checked={values.toppings.includes(topping.topping_id)}
              onChange={onChange}
            />
            {topping.text}
            <br />
          </label>
        ))}
      </div>

      <div>
        <input disabled={!formEnabled} type="submit" />
      </div>
    </form>
  );
}