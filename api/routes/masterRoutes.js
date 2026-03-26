import express from "express";


import {
    getPropertyTypes,
    getPropertyTypeById,
    addPropertyType,
    updatePropertyType,
    deletePropertyType
} from "../controllers/Master/propertyTypeController.js";

import {
    getCities,
    getCityById,
    getCitiesByStateId,
    addCity,
    updateCity,
    deleteCity
} from "../controllers/Master/cityController.js";

import {
    getAreas,
    getAreaById,
    getAreasByCityId,
    addArea,
    updateArea,
    deleteArea
} from "../controllers/Master/areaController.js";

import {
    getCountries,
    getCountryById,
    addCountry,
    updateCountry,
    deleteCountry
} from "../controllers/Master/countryController.js";

import {
    getStates,
    getStateById,
    getStatesByCountryId,
    addState,
    updateState,
    deleteState,
} from "../controllers/Master/stateController.js";

const router = express.Router();

// Property Type
router.get("/property-type", getPropertyTypes);
router.get("/property-type/:id", getPropertyTypeById);
router.post("/property-type", addPropertyType);
router.put("/property-type/:id", updatePropertyType);
router.delete("/property-type/:id", deletePropertyType);

// City
router.get("/city", getCities);
router.get("/city/:id", getCityById);
router.get("/city/state/:stateId", getCitiesByStateId);
router.post("/city", addCity);
router.put("/city/:id", updateCity);
router.delete("/city/:id", deleteCity);

// Area
router.get("/area", getAreas);
router.get("/area/:id", getAreaById);
router.get("/area/city/:cityId", getAreasByCityId);
router.post("/area", addArea);
router.put("/area/:id", updateArea);
router.delete("/area/:id", deleteArea);

// Country
router.get("/country", getCountries);
router.get("/country/:id", getCountryById);
router.post("/country", addCountry);
router.put("/country/:id", updateCountry);
router.delete("/country/:id", deleteCountry);

// State
router.get("/state", getStates);
router.get("/state/:id", getStateById);
router.get("/state/country/:countryId", getStatesByCountryId);
router.post("/state", addState);
router.put("/state/:id", updateState);
router.delete("/state/:id", deleteState);

export default router;