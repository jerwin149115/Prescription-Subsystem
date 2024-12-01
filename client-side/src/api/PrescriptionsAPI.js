import axios from 'axios';
const API_URL = `http://localhost/api`

export const getPrescription = async (patientId) => {
    if (!patientId) {
        console.error('Patient ID is required to fetch prescriptions.');
        return null;
    }

    try {
        const endpoint = `${API_URL}/getPrescription.php?patientId=${patientId}`;
        const response = await axios.get(endpoint);

        if (response.data) {
            return response.data;
        } else {
            console.error('No data found for the given Patient ID.');
            return null;
        }
    } catch (error) {
        console.error('Error fetching the prescription:', error);
        return null;
    }
};


export const getPatient = async() => {
    try {
        const response = await axios.get(`${API_URL}/getPatient.php`);
        if (response.data) {
            return response.data;
        } else {
            console.error('No data found');
            return null;
        }
    } catch (error) {
        console.error('Error fetching the prescriptions', error);
        return null
    }
}

export const addPrescription = async (prescription) => {
    console.log(prescription)
    try {
        const response = await axios.post(`${API_URL}/addPrescription.php`, prescription); 
        
        if (response.status !== 200) {
            throw new Error('Failed to add the prescription');
        }

        return response.data;
    } catch (error) {
        console.error('Error in adding the prescription:', error);
        throw error;
    }
};

export const editPrescription = async (id, prescription) => {
    try {
        const response = await axios.put(`${API_URL}/editPrescription.php?id=${id}`, prescription);

        if (response.status !== 200) {
            throw new Error('Failed to edit the patient');
        }

        return response.data;
    } catch (error) {
        console.error('Error in editing the patient: ', error);
        throw error;
    }
}

export const deletePrescription = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/deletePrescription.php`, {
            data: { prescriptionId: id },
            headers: { "Content-Type": "application/json" },
        });

        if (response.status !== 200) {
            throw new Error("Failed to delete the patient");
        }

        console.log("Patient deleted successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error deleting the patient:", error);
        throw error;
    }
};


export const addPatient = async (patient) => {
    try {
        const response = await axios.post(`${API_URL}/addPatient.php`, patient); 
        
        if (response.status !== 200) {
            throw new Error('Failed to add the patient');
        }

        return response.data;
    } catch (error) {
        console.error('Error in adding the patient:', error);
        throw error;
    }
};

export const editPatient = async (id, patient) => {
    try {
        const response = await axios.put(`${API_URL}/editPatient.php?id=${id}`, patient);

        if (response.status !== 200) {
            throw new Error('Failed to edit the patient');
        }

        return response.data;
    } catch (error) {
        console.error('Error in editing the patient: ', error);
        throw error;
    }
}

export const deletePatient = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/deletePatient.php`, {
            data: { patientId: id },
            headers: { "Content-Type": "application/json" },
        });

        if (response.status !== 200) {
            throw new Error("Failed to delete the patient");
        }

        console.log("Patient deleted successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error deleting the patient:", error);
        throw error;
    }
};