import React, { useState, useEffect } from "react";
import "./App.css";
import imagePng from "./assets/image-out.png";
import defaultAvatar from "./assets/image-out.png";

function App() {
  const propertyTypes = [
    "Flats / Apartments",
    "Independent / Builder Floors",
    "Farm House",
    "House & Villa",
  ];
  const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Delhi",
  ];
  const bhkOptions = ["1", "2", "3", "4", "4+"];
  const bathroomOptions = ["1", "2", "3", "4", "4+"];
  const furnishingOptions = ["Furnished", "Semi-Furnished", "Unfurnished"];
  const projectStatusOptions = [
    "New Launch",
    "Ready to Move",
    "Under Construction",
  ];
  const [profileImage, setProfileImage] = useState(null);
  const [userName, setUserName] = useState("Sagar");
  const maxNameLength = 30;
  const phoneNumber = "+91 8809197377";

  const listedByOptions = ["Builder", "Dealer", "Owner"];
  const carParking = ["0", "1", "2", "3", "3+"];
  const facingOptions = [
    "East",
    "North",
    "North-East",
    "North-West",
    "South",
    "South-East",
    "South-West",
    "West",
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
    if (selectedFile || photos.length < 1) {
      setPhotos((prevPhotos) => [...prevPhotos, selectedFile]);
    }
  };

  const handleDeletePhoto = (indexToRemove) => {
    setPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== indexToRemove));
  };

  const validateField = (field, value) => {
    let message = "";
    const requiredFields = [
      "type",
      "bhk",
      "bathrooms",
      "furnishing",
      "projectStatus",
      "listedBy",
      "superBuiltupArea",
      "carpetArea",
      "price",
      "title",
      "description",
      "location",
    ];

    if (requiredFields.includes(field) && !value) {
      message = "This field is required.";
    } else {
      const numericValue = parseInt(value, 10);
      if (field === "carpetArea" && numericValue > 99999999) {
        message = "Carpet Area sqft has a maximum value of 99999999.";
      }
      if (field === "maintenance" && numericValue > 99999999) {
        message = "Maintenance (Monthly) has a maximum value of 99999999.";
      }
      if (field === "totalFloors" && numericValue > 200) {
        message = "Total Floors has a maximum value of 200.";
      }
      if (field === "floorNo" && numericValue > 200) {
        message = "Floor No has a maximum value of 200.";
      }
    }

    setErrors((prev) => ({ ...prev, [field]: message }));
  };
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
    }
  };

  const handleSelect = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const isFormValid = () => {
    const requiredFields = [
      "type",
      "bhk",
      "bathrooms",
      "furnishing",
      "projectStatus",
      "listedBy",
      "superBuiltupArea",
      "carpetArea",
      "price",
      "title",
      "description",
      "location",
    ];
    return requiredFields.every((field) => formData[field]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      validateField(field, formData[field]);
      if (
        !formData[field] &&
        [
          "type",
          "bhk",
          "bathrooms",
          "furnishing",
          "projectStatus",
          "listedBy",
          "superBuiltupArea",
          "carpetArea",
          "price",
          "title",
          "description",
          "location",
        ].includes(field)
      ) {
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
    setFormData((prev) => ({ ...prev, price: raw }));
    validateField("price", raw);
  };

  const renderButtons = (field, options) =>
    options.map((option) => (
      <button
        key={option}
        type="button"
        className={`option-button ${
          formData[field] === option ? "selected" : ""
        }`}
        onClick={() => handleSelect(field, option)}
      >
        {option}
      </button>
    ));

  const LocationSelector = () => {
    const [selectedTab, setSelectedTab] = useState("list");
    const [autoLocation, setAutoLocation] = useState("");

    const fetchCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
              );
              const data = await res.json();
              const stateName = data.address?.state || "Unknown";
              setAutoLocation(stateName);
              setFormData((prev) => ({ ...prev, location: stateName }));
              validateField("location", stateName);
            } catch {
              setAutoLocation("Error retrieving location");
            }
          },
          () => {
            setAutoLocation("Unable to retrieve location");
          }
        );
      } else {
        setAutoLocation("Geolocation not supported");
      }
    };

    useEffect(() => {
      if (selectedTab === "current") {
        fetchCurrentLocation();
      }
    }, [selectedTab]);

    return (
      <div className="location-selector">
        <div className="tab-buttons">
          <button
            type="button"
            className={selectedTab === "list" ? "active" : ""}
            onClick={() => setSelectedTab("list")}
          >
            Select State
          </button>
          <button
            type="button"
            className={selectedTab === "current" ? "active" : ""}
            onClick={() => setSelectedTab("current")}
          >
            Use Current Location
          </button>
        </div>
        {selectedTab === "list" ? (
          <>
            <select
              className={errors.location ? "input-error" : ""}
              value={formData.location}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, location: e.target.value }));
                validateField("location", e.target.value);
              }}
            >
              <option value="">Select State</option>
              {indianStates.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            {errors.location && <p className="error">{errors.location}</p>}
          </>
        ) : (
          <p>{autoLocation || "Fetching location..."}</p>
        )}
      </div>
    );
  };

  return (
    <div className="form-container">
      <h2>POST YOUR AD  <span className="name-sagar">#created by Sagar Gupta</span></h2>
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
          <div className="button-group">
            {renderButtons("type", propertyTypes)}
          </div>
          {errors.type && <p className="error">{errors.type}</p>}

          <label>BHK *</label>
          <div className="button-group">{renderButtons("bhk", bhkOptions)}</div>
          {errors.bhk && <p className="error">{errors.bhk}</p>}

          <label>Bathrooms *</label>
          <div className="button-group">
            {renderButtons("bathrooms", bathroomOptions)}
          </div>
          {errors.bathrooms && <p className="error">{errors.bathrooms}</p>}

          <label>Furnishing *</label>
          <div className="button-group">
            {renderButtons("furnishing", furnishingOptions)}
          </div>
          {errors.furnishing && <p className="error">{errors.furnishing}</p>}

          <label>Project Status *</label>
          <div className="button-group">
            {renderButtons("projectStatus", projectStatusOptions)}
          </div>
          {errors.projectStatus && (
            <p className="error">{errors.projectStatus}</p>
          )}

          <label>Listed by *</label>
          <div className="button-group">
            {renderButtons("listedBy", listedByOptions)}
          </div>
          {errors.listedBy && <p className="error">{errors.listedBy}</p>}

          <label>Super Builtup area sqft *</label>
          <input
            className={errors.superBuiltupArea ? "input-error" : ""}
            type="number"
            name="superBuiltupArea"
            value={formData.superBuiltupArea}
            onChange={handleChange}
          />
          {errors.superBuiltupArea && (
            <p className="error">{errors.superBuiltupArea}</p>
          )}

          <label>Carpet Area sqft *</label>
          <input
            className={errors.carpetArea ? "input-error" : ""}
            type="number"
            name="carpetArea"
            value={formData.carpetArea}
            onChange={handleChange}
          />
          {errors.carpetArea && <p className="error">{errors.carpetArea}</p>}

          <label>Maintenance (Monthly)</label>
          <input
            className={errors.maintenance ? "input-error" : ""}
            type="number"
            name="maintenance"
            value={formData.maintenance}
            onChange={handleChange}
          />
          {errors.maintenance && <p className="error">{errors.maintenance}</p>}

          <label>Total Floors</label>
          <input
            className={errors.totalFloors ? "input-error" : ""}
            type="number"
            name="totalFloors"
            value={formData.totalFloors}
            onChange={handleChange}
          />
          {errors.totalFloors && <p className="error">{errors.totalFloors}</p>}

          <label>Floor No</label>
          <input
            className={errors.floorNo ? "input-error" : ""}
            type="number"
            name="floorNo"
            value={formData.floorNo}
            onChange={handleChange}
          />
          {errors.floorNo && <p className="error">{errors.floorNo}</p>}

          <label>Car Parking</label>
          <div className="button-group">
            {renderButtons("parking", carParking)}
          </div>

          <label>Facing</label>
          <select name="facing" value={formData.facing} onChange={handleChange}>
            <option value=""></option>
            {facingOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <label>Project Name</label>
          <div className="char-input-wrapper">
            <input
              type="text"
              name="projectName"
              maxLength={70}
              value={formData.projectName}
              onChange={handleChange}
            />
            <div className="char-count">{formData.projectName.length} / 70</div>
          </div>

          <label>Ad Title *</label>
          <div className="char-input-wrapper">
            <input
              className={errors.title ? "input-error" : ""}
              type="text"
              name="title"
              placeholder="Mention the key features of your item (e.g. brand, model, age, type)"
              maxLength={70}
              value={formData.title}
              onChange={handleChange}
            />
            <div className="char-count">{formData.title.length} / 70</div>
            {errors.title && <p className="error">{errors.title}</p>}
          </div>

          <label>Description *</label>
          <div className="char-input-wrapper">
            <textarea
              className={errors.description ? "input-error" : ""}
              name="description"
              placeholder="Include condition, features and reason for selling"
              maxLength={4096}
              rows={4}
              value={formData.description}
              onChange={handleChange}
            />
            <div className="char-count">
              {formData.description.length} / 4096
            </div>
            {errors.description && (
              <p className="error">{errors.description}</p>
            )}
          </div>

          <label>Price *</label>
          <div className="price-input-container">
            <div className="currency-symbol-box">₹</div>
            <input
              className={`price-input ${errors.price ? "input-error" : ""}`}
              type="text"
              name="price"
              value={formatIndianCurrency(formData.price)}
              onChange={handlePriceChange}
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
                    <img
                      src={imagePng}
                      alt="Placeholder"
                      className="camera-icon"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="lining"></div>
          <label className="location-label">Confirm Your Location *</label>
          <LocationSelector />
          <div className="profile-review-section">
            <h3>REVIEW YOUR DETAILS</h3>
            <div className="profile-info">
              <label className="profile-image-container">
                <img
                  src={
                    profileImage
                      ? URL.createObjectURL(profileImage)
                      : defaultAvatar
                  }
                  alt="Profile"
                  className="profile-image"
                />

                <div className="camera-overlay">
                  <img
                    src={imagePng}
                    alt="Upload"
                    className="camera-icon-overlay"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                    style={{ display: "none" }}
                  />
                </div>
              </label>
              <div className="name-input-group">
                <label>Name</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => {
                    if (e.target.value.length <= maxNameLength) {
                      setUserName(e.target.value);
                    }
                  }}
                />
                <div className="char-count">{`${userName.length} / ${maxNameLength}`}</div>
              </div>
            </div>
            <div className="phone-number-display">
              <p>Your phone number</p>
              <strong>{phoneNumber}</strong>
            </div>
          </div>
        </div>
        <button type="submit" className="submit-btn" disabled={!isFormValid()}>
          Post Now
        </button>
      </form>
    </div>
  );
}

export default App;
