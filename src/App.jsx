import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function App() {
  const [classes, setClasses] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [subjects, setSubjects] = useState([]); // Store all subjects here
  const [subjectInput, setSubjectInput] = useState('');
  const [slotInput, setSlotInput] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [eligibleClasses, setEligibleClasses] = useState([]);
  const [teachersList, setTeachersList] = useState([]); // New state to store all teachers
  const [classSlots, setClassSlots] = useState([]); // Track slots per day for each class
  const [holidays, setHolidays] = useState([]);

  // Load data from localStorage on component mount
  useEffect(() => {
    const storedClasses = JSON.parse(localStorage.getItem('classes')) || [];
    const storedSubjects = JSON.parse(localStorage.getItem('subjects')) || [];
    const storedTeachersList = JSON.parse(localStorage.getItem('teachersList')) || [];
    const storedClassSlots = JSON.parse(localStorage.getItem('classSlots')) || [];
    const storedHolidays = JSON.parse(localStorage.getItem('holidays')) || [];


    setClasses(storedClasses);
    setSubjects(storedSubjects);
    setTeachersList(storedTeachersList);
    setClassSlots(storedClassSlots);
    setHolidays(storedHolidays);
  }, []);

  // Save data to localStorage whenever the state changes
  useEffect(() => {
    localStorage.setItem('classes', JSON.stringify(classes));
    localStorage.setItem('subjects', JSON.stringify(subjects));
    localStorage.setItem('teachersList', JSON.stringify(teachersList));
    localStorage.setItem('classSlots', JSON.stringify(classSlots));
    localStorage.setItem('holidays', JSON.stringify(holidays));
  }, [classes, subjects, teachersList, classSlots,holidays]);

  const addClass = () => {
    if (inputValue.trim() !== '' && !classes.includes(inputValue)) {
      setClasses([...classes, inputValue]);
      setInputValue('');
    }
  };

  const addSubject = () => {
    if (subjectInput.trim() !== '' && slotInput.trim() !== '' && selectedClass) {
      const newSubject = { class: selectedClass, subject: subjectInput, slotsPerWeek: slotInput };
      setSubjects([...subjects, newSubject]);
      setSubjectInput('');
      setSlotInput('');
    }
  };
  const addHoliday = (date) => {
    if (!holidays.includes(date.toDateString())) {
      setHolidays([...holidays, date.toDateString()]);
    }
  };

  const removeHoliday = (date) => {
    setHolidays(holidays.filter((day) => day !== date.toDateString()));
  };

  const handleEligibleClassChange = (e) => {
    const selectedValues = Array.from(e.target.selectedOptions, (option) => option.value);
    setEligibleClasses(selectedValues);
  };

  const handleSaveTeacher = () => {
    const teacherInfo = {
      name: teacherName,
      eligibleClasses: eligibleClasses
    };
    // Save teacher to the teachers list
    setTeachersList([...teachersList, teacherInfo]);

    // Clear the input fields after saving
    setTeacherName('');
    setEligibleClasses([]);
  };

  const subjectOptions = subjects
    .filter(subject => subject.class === selectedClass) // Filter subjects by selected class
    .map((subject, index) => subject.subject); // Get subject names

  // Function to get subjects associated with a teacher's eligible classes
  const getSubjectsForTeacher = (teacher) => {
    return subjects
      .filter(subject => teacher.eligibleClasses.includes(subject.class)) // Filter subjects based on teacher's eligible classes
      .map((subject, index) => subject.subject); // Return only the subject names
  };

  const addSlotForClass = () => {
    if (selectedClass && classSlots[selectedClass] !== undefined) {
      alert('Slots already added for this class.');
      return;
    }
    const slotsPerDay = parseInt(document.getElementById('slotsInput').value);
    if (slotsPerDay && !isNaN(slotsPerDay)) {
      setClassSlots(prev => ({
        ...prev,
        [selectedClass]: slotsPerDay
      }));
      document.getElementById('slotsInput').value = '';
    }
  };

  const handleReset = () => {
    // Clear localStorage and reset states
    localStorage.clear();
    setClasses([]);
    setSubjects([]);
    setTeachersList([]);
    setClassSlots([]);
  };

  return (
    <>
      <div>
        <label htmlFor="classInput">Class:</label>
        <input
          id="classInput"
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button onClick={addClass}>Add Class</button>
      </div>

      <div>
        <label htmlFor="classSelect">Select Class:</label>
        <select
          id="classSelect"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <option value="">Select a class</option>
          {classes.map((cls, index) => (
            <option key={index} value={cls}>{cls}</option>
          ))}
        </select>
      </div>

      {selectedClass && (
        <div>
          <label htmlFor="subjectInput">Subject:</label>
          <input
            id="subjectInput"
            type="text"
            value={subjectInput}
            onChange={(e) => setSubjectInput(e.target.value)}
          />
          <label htmlFor="slotInput">Slots per Week:</label>
          <input
            id="slotInput"
            type="number"
            value={slotInput}
            onChange={(e) => setSlotInput(e.target.value)}
          />
          <button onClick={addSubject}>Add Subject</button>
        </div>
      )}

      <div>
        <label htmlFor="teacherInput">Teacher Name:</label>
        <input
          id="teacherInput"
          type="text"
          value={teacherName}
          onChange={(e) => setTeacherName(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="eligibleClasses">Eligible Classes:</label>
        <select
          id="eligibleClasses"
          multiple
          value={eligibleClasses}
          onChange={handleEligibleClassChange}
        >
          <option value="">Select a class</option>
          {classes.map((cls, index) => (
            <option key={index} value={cls}>{cls}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="subjectSelect">Select teacher  Subject:</label>
        <select id="subjectSelect">
          <option value="">Select a teacher subject</option> 
          {subjectOptions.map((subject, index) => (
            <option key={index} value={subject}>{subject}</option>
          ))}
        </select>
      </div>

      <div>
        <button onClick={handleSaveTeacher}>Save Teacher</button>
      </div>

      <div>
        <h3>Per Day Slots for Each Class</h3>
        <label htmlFor="classSelect">Select Class:</label>
        <select
          id="classSelect"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <option value="">Select a class</option>
          {classes.map((cls, index) => (
            <option key={index} value={cls}>{cls}</option>
          ))}
        </select>
        <label htmlFor="">Enter per day slots:</label>
        <input id="slotsInput" type="number" />
        <button onClick={addSlotForClass}>Add</button>
      </div>

      {/* Display per class slots per day */}
      <div>
        <h3>Class Slots Per Day:</h3>
        <ul>
          {Object.keys(classSlots).map((className, index) => (
            <li key={index}>
              Class {className}: {classSlots[className]} slots/day
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Subjects:</h3>
        <ul>
          {subjects.map((item, index) => (
            <li key={index}>Class {item.class}: {item.subject} - {item.slotsPerWeek} slots/week</li>
          ))}
        </ul>
      </div>

      <div>
        <h3>All Teachers:</h3>
        <ul>
          {teachersList.map((teacher, index) => (
            <li key={index}>
              <strong>{teacher.name}</strong>: {teacher.eligibleClasses.join(', ')} <br />
              Subjects: {getSubjectsForTeacher(teacher).join(', ')}
            </li>
          ))}
        </ul>
      </div>
      <div>
      <div>
        <h3>Mark Holidays:</h3>
        <Calendar onClickDay={addHoliday} />
      </div>

      <div>
        <h3>Holiday List:</h3>
        <ul>
          {holidays.map((holiday, index) => (
            <li key={index}>{holiday} <button onClick={() => removeHoliday(new Date(holiday))}>Remove</button></li>
          ))}
        </ul>
      </div>
      </div>
      <div>
      <button >genrate timetable</button>
      </div>

      {/* Reset Button */}
      <button onClick={handleReset}>Reset All Data</button>
    </>
  );
}

export default App;

