import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  /* =======================
     STATE MANAGEMENT
  ======================= */
  const [students, setStudents] = useState([]);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [stuClass, setStuClass] = useState('');
  const [editingId, setEditingId] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortAsc, setSortAsc] = useState(true);

  /* =======================
     FETCH DATA ON LOAD
  ======================= */
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/students');
      setStudents(res.data);
    } catch (err) {
      console.error('Failed to fetch students:', err);
    }
  };

  /* =======================
     FORM SUBMIT (CREATE / UPDATE)
  ======================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const studentData = {
      name,
      age: Number(age),
      class: stuClass,
    };

    try {
      if (editingId) {
        const res = await axios.put(
          `http://localhost:5000/api/students/${editingId}`,
          studentData
        );
        setStudents(prev =>
          prev.map(s => (s._id === editingId ? res.data : s))
        );
      } else {
        const res = await axios.post(
          'http://localhost:5000/api/students',
          studentData
        );
        setStudents(prev => [...prev, res.data]);
      }
      resetForm();
    } catch (err) {
      console.error('Submit error:', err);
    }
  };

  /* =======================
     ACTIONS
  ======================= */
  const handleEdit = (student) => {
    setName(student.name);
    setAge(student.age);
    setStuClass(student.class);
    setEditingId(student._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/students/${id}`);
      setStudents(prev => prev.filter(s => s._id !== id));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const resetForm = () => {
    setName('');
    setAge('');
    setStuClass('');
    setEditingId(null);
  };

  /* =======================
     FILTER + SORT
  ======================= */
  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (a.name < b.name) return sortAsc ? -1 : 1;
    if (a.name > b.name) return sortAsc ? 1 : -1;
    return 0;
  });

  /* =======================
     UI
  ======================= */
return (
  <div className="App">
    <h1 className="title">🎓 Student Management System</h1>

    {/* ===== FORM ===== */}
    <div className="card form-card">
      <h2 className="card-title">
        {editingId ? '✏️ Edit Student' : '➕ Add New Student'}
      </h2>

      <form onSubmit={handleSubmit} className="form">

        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            placeholder="Enter full name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Age</label>
          <input
            type="number"
            min="1"
            max="100"
            placeholder="Enter age"
            value={age}
            onChange={e => setAge(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Class</label>
          <input
            type="text"
            placeholder="Ex: 12A1"
            value={stuClass}
            onChange={e => setStuClass(e.target.value)}
            required
          />
        </div>

        <div className="button-group">
          <button type="submit" className="btn-primary">
            {editingId ? 'Update Student' : 'Add Student'}
          </button>

          {editingId && (
            <button
              type="button"
              className="btn-secondary"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </div>

      </form>
    </div>

    {/* ===== TABLE ===== */}
    <div className="card table-card">
      <h2 className="card-title">📋 Student List</h2>

      <div className="controls">
        <input
          className="search-input"
          placeholder="🔍 Search by name..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />

        <button
          className="btn-sort"
          onClick={() => setSortAsc(!sortAsc)}
        >
          {sortAsc ? '⬇ Sort Z → A' : '⬆ Sort A → Z'}
        </button>
      </div>

      {sortedStudents.length === 0 ? (
        <p className="no-data">No students found</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Class</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {sortedStudents.map(s => (
                <tr key={s._id}>
                  <td>{s.name}</td>
                  <td>{s.age}</td>
                  <td>{s.class}</td>
                  <td className="action-buttons">

                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(s)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(s._id)}
                    >
                      Delete
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  </div>
);

}

export default App;
