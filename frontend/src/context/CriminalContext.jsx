import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react'; // Import useCallback and useMemo
import {
  getCriminals as apiGetCriminals,
  registerCriminal as apiRegisterCriminal,
  detectCriminals as apiDetectCriminals,
  getCriminalById as apiGetCriminalById,
  deleteCriminal as apiDeleteCriminal,
} from '../services/criminalService.js';

const CriminalContext = createContext();

export const useCriminals = () => {
  return useContext(CriminalContext);
};

const criminalReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
    case 'REGISTER_REQUEST':
    case 'DETECT_REQUEST':
    case 'FETCH_ONE_REQUEST':
    case 'DELETE_REQUEST':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, criminals: action.payload };
    case 'FETCH_ONE_SUCCESS':
      return { ...state, loading: false };
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        loading: false,
        criminals: [action.payload, ...state.criminals],
      };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        loading: false,
        criminals: state.criminals.filter((c) => c._id !== action.payload),
      };
    case 'DETECT_SUCCESS':
        return { ...state, loading: false, detections: action.payload };
    case 'REQUEST_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export const CriminalProvider = ({ children }) => {
  const initialState = {
    criminals: [],
    detections: [],
    loading: false,
    error: null,
  };

  const [state, dispatch] = useReducer(criminalReducer, initialState);

  // --- FIX: Wrap all functions in useCallback ---

  const fetchCriminals = useCallback(async () => {
    dispatch({ type: 'FETCH_REQUEST' });
    try {
      const data = await apiGetCriminals();
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
    } catch (error) {
      dispatch({ type: 'REQUEST_FAIL', payload: error.response?.data?.message || error.message });
    }
  }, [dispatch]);
  
  const fetchCriminalById = useCallback(async (id) => {
    dispatch({ type: 'FETCH_ONE_REQUEST' });
    try {
        const data = await apiGetCriminalById(id);
        dispatch({ type: 'FETCH_ONE_SUCCESS' });
        return data; // Return data directly to the component
    } catch (error) {
        dispatch({ type: 'REQUEST_FAIL', payload: error.response?.data?.message || error.message });
        throw error; // Re-throw to be caught in the component
    }
  }, [dispatch]);

  const registerCriminal = useCallback(async (criminalData) => {
    dispatch({ type: 'REGISTER_REQUEST' });
    try {
      const data = await apiRegisterCriminal(criminalData);
      dispatch({ type: 'REGISTER_SUCCESS', payload: data });
    } catch (error) {
      dispatch({ type: 'REQUEST_FAIL', payload: error.response?.data?.message || error.message });
      throw error; // Re-throw to be caught in the component
    }
  }, [dispatch]);

  const deleteCriminal = useCallback(async (id) => {
    dispatch({ type: 'DELETE_REQUEST' });
    try {
      await apiDeleteCriminal(id);
      dispatch({ type: 'DELETE_SUCCESS', payload: id });
    } catch (error) {
      dispatch({ type: 'REQUEST_FAIL', payload: error.response?.data?.message || error.message });
      throw error; // Re-throw to be caught in the component
    }
  }, [dispatch]);

  const detectCriminals = useCallback(async (base64Image) => {
    dispatch({ type: 'DETECT_REQUEST' });
    try {
        const data = await apiDetectCriminals(base64Image);
        dispatch({ type: 'DETECT_SUCCESS', payload: data });
        return data; // Return data directly
    } catch (error) {
        dispatch({ type: 'REQUEST_FAIL', payload: error.response?.data?.message || error.message });
        throw error; // Re-throw
    }
  }, [dispatch]);


  // --- FIX: Wrap the value object in useMemo ---
  const value = useMemo(() => ({
    ...state,
    fetchCriminals,
    registerCriminal,
    detectCriminals,
    fetchCriminalById,
    deleteCriminal,
  }), [state, fetchCriminals, registerCriminal, detectCriminals, fetchCriminalById, deleteCriminal]);

  return (
    <CriminalContext.Provider value={value}>
        {children}
    </CriminalContext.Provider>
  );
};