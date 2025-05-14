import React, { useState, useEffect } from "react";
import "./App.css";
import imagePng from "./assets/image-out.png";

function App() {
  const propertyTypes = [
    "Flats / Apartments",
    "Independent / Builder Floors",
    "Farm House",
    "House & Villa",
  ];
  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
    'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
    'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
    'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
    'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi'
  ];
  const bhkOptions = ["1", "2", "3", "4", "4+"];
  const bathroomOptions = ["1", "2", "3", "4", "4+"];
  const furnishingOptions = ["Furnished", "Semi-Furnished", "Unfurnished"];
  const projectStatusOptions = ["New Launch", "Ready to Move", "Under Construction"];
  const listedByOptions = ["Builder", "Dealer", "Owner"];
  const carParking = ["0", "1", "2", "3", "3+"];
  const facingOptions = [
    "East", "North", "North-East", "North-West", "South",
    "South-East", "South-West", "West",
  ];

  const [formData, setFormData] = useState({
    type: "",
    bhk: "",
    bathrooms: "",
    furnishing: "",
    projectStatus: "",
    listedBy: "",
    superBuiltupArea: "",
    carpetArea: "",
    maintenance: "",
    totalFloors: "",
    floorNo: "",
    parking: "",
    facing: "",
    projectName: "",
    title: "",
    description: "",
    price: "",
    location: "",
  });

  const [errors, setErrors] = useState({});
  const [photos, setPhotos] = useState([]);

  const handlePhotoChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && photos.length < 20) {
      setPhotos((prevPhotos) => [...prevPhotos, selectedFile]);
    }
  };

  const handleDeletePhoto = (indexToRemove) => {
    setPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== indexToRemove));
  };

  const validateField = (field, value) => {
    let message = "";
    if (
      ["type", "bhk", "bathrooms", "furnishing", "projectStatus", "listedBy"].includes(field) &&
      !value
    ) {
      message = "This field is required.";
    }
    if (["superBuiltupArea", "carpetArea", "price"].includes(field) && !value) {
      message = "This field is required.";
    }

    setErrors((prev) => ({
      ...prev,
      [field]: message,
    }));
  };

  const handleSelect = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    validateField(field, value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateField(name, value);
  };

  const isFormValid = () => {
    return (
      formData.type &&
      formData.bhk &&
      formData.bathrooms &&
      formData.furnishing &&
      formData.projectStatus &&
      formData.listedBy &&
      formData.superBuiltupArea &&
      formData.carpetArea &&
      formData.price
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const requiredFields = [
      "type", "bhk", "bathrooms", "furnishing", "projectStatus",
      "listedBy", "superBuiltupArea", "carpetArea", "price"
    ];
    const newErrors = {};
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "This field is required.";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      console.log("Form Data:", formData);
      console.log("Photos:", photos);
      alert("Form submitted successfully!");
    }
  };

  const formatIndianCurrency = (value) => {
    if (!value) return "";
    const number = parseInt(value.replace(/,/g, ""), 10);
    return isNaN(number) ? "" : number.toLocaleString("en-IN");
  };

  const handlePriceChange = (e) => {
    const raw = e.target.value.replace(/,/g, "");
    if (!/^\d*$/.test(raw)) return;
    setFormData((prev) => ({
      ...prev,
      price: raw,
    }));
  };

  const renderButtons = (field, options) => {
    return options.map((option) => (
      <button
        key={option}
        type="button"
        className={`option-button ${formData[field] === option ? "selected" : ""}`}
        onClick={() => handleSelect(field, option)}
      >
        {option}
      </button>
    ));
  };

  const LocationSelector = () => {
    const [selectedTab, setSelectedTab] = useState('list');
    const [selectedState, setSelectedState] = useState('');
    const [autoLocation, setAutoLocation] = useState('');
    const [error, setError] = useState('');

    const fetchCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
              const data = await res.json();
              const stateName = data.address?.state || 'Unknown';
              setAutoLocation(stateName);
              setFormData((prev) => ({ ...prev, location: stateName }));
            } catch {
              setAutoLocation('Error retrieving location');
            }
          },
          () => {
            setAutoLocation('Unable to retrieve location');
          }
        );
      } else {
        setAutoLocation('Geolocation not supported');
      }
    };

    useEffect(() => {
      if (selectedTab === 'current') {
        fetchCurrentLocation();
      }
    }, [selectedTab]);

    return (
      <div className="location-selector">
        <div className="tab-buttons">
          <button
            type="button"
            className={selectedTab === 'list' ? 'active' : ''}
            onClick={() => setSelectedTab('list')}
          >
            Select State
          </button>
          <button
            type="button"
            className={selectedTab === 'current' ? 'active' : ''}
            onClick={() => setSelectedTab('current')}
          >
            Use Current Location
          </button>
        </div>

        {selectedTab === 'list' ? (
          <select value={formData.location} onChange={(e) => {
            setSelectedState(e.target.value);
            setFormData((prev) => ({ ...prev, location: e.target.value }));
          }}>
            <option value="">Select State</option>
            {indianStates.map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        ) : (
          <p>{autoLocation || 'Fetching location...'}</p>
        )}
      </div>
    );
  };

  return (
    <div className="form-container">
      <h2>POST YOUR AD</h2>
      <div className="category-section">
        <h4>SELECTED CATEGORY</h4>
        <p>
          Properties / For Sale: Houses & Apartments <a href="#">Change</a>
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h4>INCLUDE SOME DETAILS</h4>

          <label>Type *</label>
          <div className="button-group">{renderButtons("type", propertyTypes)}</div>
          {errors.type && <p className="error">{errors.type}</p>}

          <label>BHK *</label>
          <div className="button-group">{renderButtons("bhk", bhkOptions)}</div>
          {errors.bhk && <p className="error">{errors.bhk}</p>}

          <label>Bathrooms *</label>
          <div className="button-group">{renderButtons("bathrooms", bathroomOptions)}</div>
          {errors.bathrooms && <p className="error">{errors.bathrooms}</p>}

          <label>Furnishing *</label>
          <div className="button-group">{renderButtons("furnishing", furnishingOptions)}</div>
          {errors.furnishing && <p className="error">{errors.furnishing}</p>}

          <label>Project Status *</label>
          <div className="button-group">{renderButtons("projectStatus", projectStatusOptions)}</div>
          {errors.projectStatus && <p className="error">{errors.projectStatus}</p>}

          <label>Listed by *</label>
          <div className="button-group">{renderButtons("listedBy", listedByOptions)}</div>
          {errors.listedBy && <p className="error">{errors.listedBy}</p>}

          <label>Super Builtup area sqft *</label>
          <input type="number" name="superBuiltupArea" value={formData.superBuiltupArea} onChange={handleChange} />
          {errors.superBuiltupArea && <p className="error">{errors.superBuiltupArea}</p>}

          <label>Carpet Area sqft *</label>
          <input type="number" name="carpetArea" value={formData.carpetArea} onChange={handleChange} />
          {errors.carpetArea && <p className="error">{errors.carpetArea}</p>}

          <label>Maintenance (Monthly)</label>
          <input type="number" name="maintenance" value={formData.maintenance} onChange={handleChange} />

          <label>Total Floors</label>
          <input type="number" name="totalFloors" value={formData.totalFloors} onChange={handleChange} />

          <label>Floor No</label>
          <input type="number" name="floorNo" value={formData.floorNo} onChange={handleChange} />

          <label>Car Parking</label>
          <div className="button-group">{renderButtons("parking", carParking)}</div>

          <label>Facing</label>
          <select name="facing" value={formData.facing} onChange={handleChange}>
            <option value=""></option>
            {facingOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>

          <label>Project Name</label>
          <input type="text" name="projectName" value={formData.projectName} onChange={handleChange} />

          <label>Ad Title *</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} />

          <label>Description *</label>
          <input type="text" name="description" value={formData.description} onChange={handleChange} />

          <label>Price *</label>
          <div className="price-input-container">
            <div className="currency-symbol-box">₹</div>
            <input
              type="text"
              name="price"
              value={formatIndianCurrency(formData.price)}
              onChange={handlePriceChange}
              className="price-input"
            />
          </div>
          {errors.price && <p className="error">{errors.price}</p>}

          <label>UPLOAD UP TO 20 PHOTOS</label>
          <div className="photo-grid">
            {Array.from({ length: 20 }).map((_, index) => (
              <div key={index} className="photo-slot">
                {photos[index] ? (
                  <div className="photo-preview-container">
                    <img
                      src={URL.createObjectURL(photos[index])}
                      alt={`photo-${index}`}
                      className="photo-preview"
                    />
                    <button
                      type="button"
                      className="delete-icon"
                      onClick={() => handleDeletePhoto(index)}
                    >
                      &times;
                    </button>
                  </div>
                ) : index === photos.length ? (
                  <label className="add-photo-label">
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handlePhotoChange}
                    />
                    <div className="add-photo-placeholder">
                      <img src={imagePng} alt="Add" className="camera-icon" />
                      <span>Add Photo</span>
                    </div>
                  </label>
                ) : (
                  <div className="photo-placeholder">
                    <img src={imagePng} alt="Placeholder" className="camera-icon" />
                  </div>
                )}
              </div>
            ))}
          </div>
            <div className="lining"></div>
          <label className="location-label">Confirm Your Location *</label>
          <LocationSelector />
        </div>

        <button type="submit" className="submit-btn" disabled={!isFormValid()}>
          Post Now
        </button>
      </form>
    </div>
  );
}

export default App;
