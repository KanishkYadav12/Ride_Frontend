import React, { useState } from "react";

const NewPage = () => {
     const [name, setName] = useState("")
  return (
    <div>
      <input name="name" placeholder="Name" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="password" placeholder="Password" onChange={handleChange} />
      <input name="country" placeholder="Country" onChange={handleChange} />
      <input
        name="desigantion"
        placeholder="Desigantion"
        onChange={handleChange}
      />
      <p></p>
    </div>
  );
};

export default NewPage;
