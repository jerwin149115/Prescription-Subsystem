import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from 'react-data-table-component'
import { getPatient, addPatient, editPatient, deletePatient } from "../../api/PrescriptionsAPI";
import './Prescription.css'

function Prescriptions() {
    const patientColumns = [
        { name: 'Patient ID', selector: row => row.patientId, sortable: true },
        { name: 'Patient Name', selector: row => row.patientName, sortable: true },
        { name: 'Patient Age', selector: row => row.patientAge, sortable: true },
        { name: 'Time', selector: row => row.created_patient_at, sortable: true },
        {
            name: "Actions",
            cell: (row) => (
                <div>
                    <button onClick={() => handleViewPrescription(row.patientId)} className="btn">
                        View Prescription
                    </button>
                    <button onClick={() => handleEditPatient(row)} className="btn">
                        Edit
                    </button>
                    <button onClick={() => {handleDeletePatient(row.patientId)}} className="btn">
                        Delete
                    </button>
                </div>
            ),
        },
    ];
    const navigate = useNavigate();
    const [records, setRecords] = useState([])
    const [isSearch, setIsSearch] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [newPatient, setNewPatient] = useState({
        id: '',
        patientName: '',
        patientAge: '',
    })

    const fetchData = async () => {
        if (!isSearch) {
            try {
                const patient = await getPatient();
                setRecords(patient);
            } catch (error) {
                console.error('Error fetching the patient data: ', error);
            }
        }
    };

    const pollingInterval = 20000;

    useEffect(() => {
        fetchData();
        const intervalId = setInterval(fetchData, pollingInterval);
        return () => clearInterval(intervalId);
    }, [isSearch]);

    async function handleFilter(event) {
        const searchText = event.target.value.toLowerCase();
        setIsSearch(!!searchText)

        try {
            const allPatient = await getPatient();
            const filteredPatient = allPatient.filter(patient => 
                Object.values(patient).some(value => 
                    String(value).toLowerCase().includes(searchText)
                )
            );
            setRecords(filteredPatient);
        } catch (error) {
            console.error('Error in filtering the patient: ', error);
        }
    }

    const handleViewPrescription = (patientId) => {
        navigate(`/information/${patientId}`)
    }

    const customStyles = {
        table: {
          style: {
            backgroundColor: '#fff',
          },
        },
        head: {
          style: {
            backgroundColor: '#fff',
            color: '#101010',
          },
        },
        headRow: {
          style: {
            backgroundColor: '#fff',
          },
        },
        headCells: {
          style: {
            backgroundColor: '#fff',
            color: '#1a1a1a',
            fontWeight: 'bold',
          },
        },
        rows: {
          style: {
            backgroundColor: '#fff',
            height: '7rem',
            color: '#1a1a1a',
            '&:nth-child(odd)': {
              backgroundColor: '#fff',
            },
          },
        },
        cells: {
          style: {
            backgroundColor: '#fff',
            color: '#1a1a1a',
            fontSize: '11px',
            borderBottom: '1px solid #333',
          },
        },
        pagination: {
          style: {
            backgroundColor: '#1a1a1a',
            color: '#FFD700',
          },
          pageButtonsStyle: {
            backgroundColor: '#FFD700',
            color: '#FFD700',
            border: '1px solid #1a1a1a',
            '&:hover': {
              backgroundColor: '#333',
              color: '#FFD700',
              svg: {
                color: '#FFD700',
              },
            },
          },
        },
        noData: {
          style: {
            backgroundColor: '#1a1a1a', 
            color: '#FFD700', 
            padding: '20px',
            fontSize: '16px',
          },
        },
    };

    async function handleAddPatient() {
        try {
            if (isEditing) {
                await editPatient(newPatient.patientId, newPatient);
                setRecords(records.map(patient=> (patient.patientId === newPatient.patientId ? newPatient : patient)));
                window.location.reload();
            } else {
                const addedPatient = await addPatient(newPatient);
                setRecords([...records, addedPatient]);
                window.location.reload();
            }
            setShowModal(false);
            setNewPatient({
                id: '',
                patientName: '',
                patientAge: '',
            });
        } catch (error) {
            console.error('Error in adding or updating the patient: ', error);
        }
    }

    async function handleDeletePatient(id) {
        if (!id) {
            console.error('Invalid Patient Id: ', id);
            return;
        }

        try {
            await deletePatient(id);
            const newRecords = records.filter(record => record.patientId !== id);
            setRecords(newRecords);
        } catch (error) {
            console.error('Error in deleting the Patient: ', error);
        }
    }

    function handleEditPatient(userData) {
        setNewPatient({
            ...userData,
            id: userData.patientId
        });
        setIsEditing(true);
        setShowModal(true);
    }

    return(
        <div className="container mt-5">
            <div className="table-box">
                <div className="text-end mb-3">
                    <input type="text" onChange={handleFilter} className="search-function" placeholder="Search"/>
                    <button className="btn-add" onClick={() => { setIsEditing(false); setShowModal(true);}}>Add Product</button>
                </div>

                <DataTable
                columns={patientColumns}
                data={records}
                className="data-table"
                fixedHeader
                customStyles={customStyles}
                 />
            </div>
            {showModal && (
            <div className="custom-modal-overlay-patient">
                <div className="custom-modal-patient">
                    <h5 className="modal-title">{isEditing ? 'Edit Patient' :'Add New Patient'}</h5>
                    <form>
                        <div className="mb-3">
                            <input 
                            type="text"
                            className="form-control"
                            value={newPatient.patientName}
                            placeholder="Patient Name"
                            onChange={(e) => setNewPatient({ ...newPatient, patientName: e.target.value})}
                            />
                        </div>
                        <div className="mb-3">
                            <input
                            type="text"
                            className="form-control"
                            value={newPatient.patientAge}
                            placeholder="Patient Age"
                            onChange={(e) => setNewPatient({ ...newPatient, patientAge: e.target.value})}
                            />
                        </div>
                        <button type="button" className="btn" onClick={() => setShowModal(false)}>Close</button>
                        <button type="button" className="btn" onClick={(handleAddPatient)}>
                            {isEditing ? 'Update Patient' : 'Add Patient'}
                        </button>
                    </form>
                </div>
            </div>
            )}
        </div>
    )
}

export default Prescriptions;