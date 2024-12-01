import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import './Information.css';
import { getPrescription, addPrescription, editPrescription,deletePrescription } from "../../api/PrescriptionsAPI";

function Information() {
    const prescriptionColumns = [
        { name: 'Patient ID', selector: row => row.patientId, sortable: true },
        { name: 'Patient Name', selector: row => row.patientName, sortable: true },
        { name: 'Medicine', selector: row => row.medicine, sortable: true },
        { name: 'Dosage', selector: row => row.dosage, sortable: true },
        { name: 'Doctor Name', selector: row => row.doctorName, sortable: true },
        { name: 'Time', selector: row => row.created_at, sortable: true },
        {
            name: "Actions",
            cell: (row) => (
                <div>
                    <button onClick={() => handleEditPrescription(row)} className="btn">
                        Edit
                    </button>
                    <button onClick={() => { handleDeletePrescription(row.prescriptionId) }} className="btn">
                        Delete
                    </button>
                </div>
            ),
        },
    ];

    const navigate = useNavigate();
    const { id } = useParams();
    const [prescription, setPrescription] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newPrescription, setNewPrescription] = useState({
        patientId: '',
        patientName: '',
        doctorName: '',
        medicine: '',
        dosage: '',
    });

    useEffect(() => {
        async function fetchPrescriptions() {
            try {
                const prescriptionData = await getPrescription(id);
                console.log(prescriptionData);
                setPrescription(prescriptionData);
                if (prescriptionData && prescriptionData.length > 0) {
                    setNewPrescription({
                        ...newPrescription,
                        patientId: prescriptionData[0].patientId,
                        patientName: prescriptionData[0].patientName,
                    });
                }
            } catch (error) {
                console.error('Error fetching the patient prescription: ', error);
            }
        }
        fetchPrescriptions();
    }, [id]);

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

    async function handleAddPrescription() {
        try {
            if (isEditing) {
                await editPrescription(newPrescription.prescriptionId, newPrescription);
                setPrescription(prescription.map(prescriptions => (prescriptions.patientId === newPrescription.patientId ? newPrescription : prescriptions)));
                window.location.reload();
            } else {
                const addedPrescription = await addPrescription(newPrescription);
                setPrescription([...prescription, addedPrescription]);
                window.location.reload();
            }
            setShowModal(true);
            setNewPrescription({
                patientId: '',
                patientName: '',
                doctorName: '',
                medicine: '',
                dosage: '',
            });
        } catch (error) {
            console.error('Error in adding/updating the Prescription: ', error);
        }
    }

    function handleEditPrescription(userData) {
        setNewPrescription({
            ...userData,
            id: userData.prescriptionId
        });
        setIsEditing(true);
        setShowModal(true);
    }

    async function handleDeletePrescription(prescriptionId) {
        if (!prescriptionId) {
            console.error('Invalid Prescription ID: ', prescriptionId);
            return;
        }

        try {
            await deletePrescription(prescriptionId)
            const newPrescription = prescription.filter(prescriptions => prescriptions.prescriptionId !== prescriptionId);
            setPrescription(newPrescription)
        } catch (error) {
            console.error('Error in deleting the Prescription', error)
        }
    }   

    return (
        <div className="container mt-5">
            <div className="table-box">
                <div className="text-end mb-3">
                    <button className="btn-add" onClick={() => { setIsEditing(false); setShowModal(true) }}>Add Prescription</button>
                </div>

                <DataTable
                    columns={prescriptionColumns}
                    data={prescription}
                    className="data-table"
                    fixedHeader
                    customStyles={customStyles}
                />
            </div>
            {showModal && (
                <div className="custom-modal-overlay-patient">
                    <div className="custom-modal-patient">
                        <h5 className="modal-title">{isEditing ? 'Edit Prescription' : 'Add New Prescription'}</h5>
                        <form>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={newPrescription.doctorName}
                                    placeholder="Doctor Name"
                                    onChange={(e) => setNewPrescription({ ...newPrescription, doctorName: e.target.value })}
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={newPrescription.medicine}
                                    placeholder="Medicine"
                                    onChange={(e) => setNewPrescription({ ...newPrescription, medicine: e.target.value })}
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={newPrescription.dosage}
                                    placeholder="Dosage"
                                    onChange={(e) => setNewPrescription({ ...newPrescription, dosage: e.target.value })}
                                />
                            </div>
                            <button type="button" className="btn" onClick={() => setShowModal(false)}>Close</button>
                            <button type="button" className="btn" onClick={handleAddPrescription}>
                                {isEditing ? 'Update Prescription' : 'Add Prescription'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Information;
