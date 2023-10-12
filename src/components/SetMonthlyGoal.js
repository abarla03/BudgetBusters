import React, { useState } from 'react';
import { categories } from '../predefinedCategories'
function SetMonthlyGoal() {
  console.log("SetMonthlyGoal component is rendering.")
    // return (
    //   <div>
    //     <h3>Set Monthly Budget:</h3>
    //     {/* Add your content for the SetMonthlyGoal component */}
    //   </div>
    // );

    const [budget, setBudget] = useState('');
    const [error, setError] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [createdCategories, setCreatedCategories] = useState([]);
    const [displayCreatedCategories, setDisplayCreatedCategories] = useState(false);

  /* function handling non-numeric values in budget goal field */
  const handleBudgetChange = (event) => {
    const inputBudget = event.target.value;
    const numericRegex = /^[0-9]*$/;

    if (numericRegex.test(inputBudget)) {
      setBudget(inputBudget);
      setError('');
    } else {
      setBudget(inputBudget);
      setError('Please enter a valid numerical budget.');
    }
  };

  /* function handling user's ability to select multiple categories */
  const handleCategoryClick = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  /* function handling user's ability to create new categories */
  const handleCreateCategory = () => {
    if (newCategory.trim() !== '') {
      const updatedCategories = [...createdCategories, newCategory];
      setCreatedCategories(updatedCategories);
      setNewCategory('');
    }
  };

  /* function handling user's ability to delete their created categories */
  const handleRemoveCategory = (categoryToRemove) => {
    const updatedCategories = createdCategories.filter((category) => category !== categoryToRemove);
    setCreatedCategories(updatedCategories);
  };

  const handleSubmit = () => {
    // add logic to submit here
  };

  return (
    <div>
      <h3>Set Monthly Budget:</h3>
      <div className="input-container">
        <input className='user-input-field'
          type="text"
          placeholder="Enter your budget"
          value={budget}
          onChange={handleBudgetChange}
        />
        {error && <p className="error-message">{error}</p>}
      </div>

      <h4>Select Categories:</h4>
      <div className="category-buttons">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-button${selectedCategories.includes(category) ? ' selected' : ''}`}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="create-category">
        <h4>Create Categories:</h4>
        <button className="plus-button" onClick={() => setDisplayCreatedCategories(!displayCreatedCategories)}>+</button>
      </div>

      <div className="add-field">
        {displayCreatedCategories && (
          <div>
            <input className='category-field'
              type="text"
              placeholder="Enter a new category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <button className='add-button' onClick={handleCreateCategory}>Add</button>
          </div>
        )}
      </div>

      <div className="category-buttons">
        {createdCategories.map((category) => (
          <button
          key={category}
          className={`created-category ${category}`}
          onClick={() => handleRemoveCategory(category)}>
          {category}
          </button>
        ))}
      </div>

      <button
        className="submit-button"
        type="submit"
        onClick={handleSubmit}
        disabled={error !== ''}
      >
        Submit
      </button>
    </div>
  );
}
export default SetMonthlyGoal;
