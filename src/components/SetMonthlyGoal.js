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
    const [showAllCategories, setShowAllCategories] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [allCategories, setAllCategories] = useState([]);

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
      setAllCategories(allCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
      setAllCategories([...allCategories, category]);
    }
  };

  /* function handling user's ability to create new categories */
  const handleCreateCategory = () => {
    if (newCategory.trim() !== '') {
      const updatedCategories = [...createdCategories, newCategory];
      setCreatedCategories(updatedCategories);
      setAllCategories([...allCategories, newCategory]);
      setNewCategory('');
    }
  };

  /* function handling user's ability to delete their created categories */
  const handleRemoveCategory = (categoryToRemove) => {
    const updatedCategories = createdCategories.filter((c) => c !== categoryToRemove);
    setCreatedCategories(updatedCategories);
    setAllCategories(allCategories.filter((c) => c !== categoryToRemove));
  };

  const handleSubmit = () => {
    // add logic to submit here
    setFormSubmitted(true);
    setShowAllCategories(true);
  };

  return (
    <div>
       {formSubmitted ? (
      <SelectedCategoriesPage selectedCategories={allCategories} />
    ) : (
      <>
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
        className="next-button"
        type="submit"
        onClick={handleSubmit}
        disabled={error !== ''}
      >
        Next
      </button>
      </>
    )}
    </div>
  );
}

/* set monthly goal pt.2: function handling color coding categories */
function SelectedCategoriesPage({ selectedCategories }) {
  const [colorOptions, setColorOptions] = useState({});
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false); 
  const [editableCategories, setEditableCategories] = useState([]);
  const [categoryNames, setCategoryNames] = useState({});

  const hexColorOptions = {
    Red: '#ff5c70',
    Orange: '#ffb267',
    Yellow: '#e9fc87',
    Green: '#85d67a',
    Teal: '#47c8a6',
    Blue: '#5c9dc5',
    Violet: '#6d5eb0',
    Purple: '#af7abd',
    Pink: '#e36498',
    Grey: '#ccc'
  };

  /* function handling the color change of categories when hex code is specified */
  const handleColorChange = (category, color) => {
    setColorOptions((prevColorOptions) => ({
      ...prevColorOptions,
      [category]: color,
    }));
  };

  /* function handling submit button and if all categories are colored */
  const handleSubmit = () => {
    const allCategoriesColored = selectedCategories.every(
      (category) => colorOptions[category]
    );

    if (allCategoriesColored) {
      setError('');
      setSubmitted(true);
    } else {
      setError('Please enter a color for every category.');
    }
  };

  /* function handling the category editing (ensures that only one category is edited in edit mode) */
  const handleEditCategory = (category) => {
    setEditableCategories((prevEditableCategories) => {
      if (prevEditableCategories.includes(category)) {
        return prevEditableCategories.filter((item) => item !== category);
      } else {
        return [...prevEditableCategories, category];
      }
    });
  };

  /* function to save edited category name */
  const handleSaveCategoryName = (category) => {
    setCategoryNames((prevCategoryNames) => ({
      ...prevCategoryNames,
      [category]: categoryNames[category],
    }));
    setEditableCategories((prevEditableCategories) => prevEditableCategories.filter((item) => item !== category));
  };

  return (
    <div>
      <h3>Selected Categories:</h3>
      {error && <p style={{ color: 'red'}}>{error}</p>}
      <ul>
        {selectedCategories.map((category) => (
          <li key={category}>
            <div>
            <button className="category-button"
              id={`button-${category}`} 
              style={{ backgroundColor: colorOptions[category] || '#ccc' }}
            >
            {submitted && editableCategories.includes(category) ? (
              <input
                type="text"
                value={categoryNames[category] || ""}
                onChange={(e) => setCategoryNames({ ...categoryNames, [category]: e.target.value })}
              />
            ) : (
              categoryNames[category] || category
            )}
          </button>
          {submitted && !editableCategories.includes(category) ? (
            <button
              className="edit-button"
              onClick={() => handleEditCategory(category)}
            >
              Edit
            </button>
          ) : null}
          {editableCategories.includes(category) ? (
                <button
                  className="save-button"
                  onClick={() => handleSaveCategoryName(category)}
                >
                  Save
                </button>
              ) : null}
          {submitted ? null : (
          <select
            onChange={(e) => handleColorChange(category, e.target.value)}
            value={colorOptions[category] || category}
          >
            <option value="">Choose Color</option>
            {Object.entries(hexColorOptions).map(([colorName, hexCode]) => (
              <option key={hexCode} value={hexCode}>
                {colorName}
              </option>
            ))}
          </select>
          )}
            </div>
          </li>
        ))}
      </ul>
      <button
        className="back-button"
        type="submit"
      >
        Back
      </button>
      <button
        className="next-button"
        type="submit"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
}



export default SetMonthlyGoal;
