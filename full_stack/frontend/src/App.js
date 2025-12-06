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
      <h1>Student Management</h1>

      {/* ===== Form ===== */}
      <div className="card">
        <h2>{editingId ? 'Edit Student' : 'Add New Student'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Full name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={e => setAge(e.target.value)}
            required
          />
          <input
            placeholder="Class"
            value={stuClass}
            onChange={e => setStuClass(e.target.value)}
            required
          />

          <div className="button-group">
            <button type="submit">
              {editingId ? 'Update' : 'Add'}
            </button>
            {editingId && (
              <button type="button" className="btn-cancel" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ===== Table ===== */}
      <div className="card">
        <h2>Student List</h2>

        <div className="controls">
          <input
            className="search-input"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <button className="btn-sort" onClick={() => setSortAsc(!sortAsc)}>
            Sort: {sortAsc ? 'A → Z' : 'Z → A'}
          </button>
        </div>

        {sortedStudents.length === 0 ? (
          <p>No students found</p>
        ) : (
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
                  <td>
                    <button className="btn-edit" onClick={() => handleEdit(s)}>
                      Edit
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(s._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;
