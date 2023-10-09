import React, { useState } from 'react';
import './App.css';
import logo from './BBLogo.png';
import { categories } from './predefinedCategories.js'

/* home page UI */
function Home() {
  return (
    <section id="home">
    </section>
  )
}

/* set monthly goal page UI */
function SetMonthlyGoal() {
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

  /* function that leads user to color code their categories after submission */
  const handleSubmit = () => {
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

  const handleColorChange = (category, color) => {
    setColorOptions((prevColorOptions) => ({
      ...prevColorOptions,
      [category]: color,
    }));
  };

  return (
    <div>
      <h3>Selected Categories:</h3>
      <ul>
        {selectedCategories.map((category) => (
          <li key={category}>
            <button className="category-button"
              id={`button-${category}`} 
              style={{ backgroundColor: colorOptions[category] || '#ccc' }}
            >
              {category}
            </button>
            <select
              onChange={(e) => handleColorChange(category, e.target.value)}
              value={colorOptions[category] || ''}
            >
              <option value="">Choose Color</option>
              {Object.entries(hexColorOptions).map(([colorName, hexCode]) => (
                <option key={hexCode} value={hexCode}>
                  {colorName}
                </option>
              ))}
            </select>
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
      >
        Submit
      </button>
    </div>
  );
}

/* category breakdown page UI */
function CategoryBreakdown() {
  return (
    <h2>category breakdown</h2>
  )
}

/* input daily spending UI */
function InputDailySpending() {
  return (
    <h2>input daily spending</h2>
  )
}

/* handle rendering of pages and options */
function App() {
  const [currentPage, setCurrentPage] = React.useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home/>;
      case 'setMonthlyGoal':
        return <SetMonthlyGoal/>;
      case 'categoryBreakdown':
        return <CategoryBreakdown/>;
      case 'inputDailySpending':
        return <InputDailySpending/>;
      default:
        return <Home/>;
    }
  };

  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  /* return home page structure */
  return (
    <div className="App">
      <nav>
        <ul>
          <li>
            <button className='nav-button' onClick={() => handleNavigation('home')}>Home</button>
          </li>
          <li>
            <button className='nav-button' onClick={() => handleNavigation('setMonthlyGoal')}>Set Monthly Goal</button>
          </li>
          <li>
            <button className='nav-button' onClick={() => handleNavigation('categoryBreakdown')}>Category Breakdown</button>
          </li>
          <li>
            <button className='nav-button' onClick={() => handleNavigation('inputDailySpending')}>Input Daily Spending</button>
          </li>
        </ul>
      </nav>
      
      <div class="box">
        <img
          src={logo} alt = ''
        />

        <main>{renderPage()}</main>
      </div>
    </div>
  );
}

export default App;