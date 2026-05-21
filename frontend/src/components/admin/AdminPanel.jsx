import { useEffect, useState } from 'react';
import api from '../../services/api';

const emptyLesson = {
  title: '',
  moduleSlug: 'bukh',
  durationMin: 10,
  level: 'Анхан',
  xpReward: 50,
  content: '',
  description: '',
  isPremium: false
};

const emptyQuestion = {
  moduleSlug: 'bukh',
  quizTitle: '',
  text: '',
  options: ['', '', '', ''],
  correctOptionIndex: 0,
  points: 10,
  explanation: '',
  isPremium: false
};

const modules = [
  { slug: 'bukh', name: 'Хүчит Бөх' },
  { slug: 'horse', name: 'Хурдан Морь' },
  { slug: 'livestock', name: 'Таван Хошуу' },
  { slug: 'dairy', name: 'Цагаан Идээ' },
  { slug: 'ger', name: 'Монгол Гэр' }
];

const fieldStyle = {
  padding: '10px',
  borderRadius: 8,
  border: '1px solid var(--border)',
  background: 'var(--bg1)',
  color: 'var(--text)'
};

const panelStyle = {
  background: 'var(--card)',
  borderRadius: 8,
  padding: 20,
  border: '1px solid var(--border)'
};

export const AdminPanel = ({ showToast }) => {
  const [activeTab, setActiveTab] = useState('lessons');
  const [lessons, setLessons] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [users, setUsers] = useState([]);
  const [lessonForm, setLessonForm] = useState(emptyLesson);
  const [questionForm, setQuestionForm] = useState(emptyQuestion);
  const [editingLessonId, setEditingLessonId] = useState(null);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchLessons = async () => {
    const res = await api.get('/admin/lessons');
    setLessons(res.data);
  };

  const fetchQuestions = async () => {
    const res = await api.get('/admin/questions');
    setQuestions(res.data);
  };

  const fetchUsers = async () => {
    const res = await api.get('/admin/users');
    setUsers(res.data);
  };

  const loadAdminData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchLessons(), fetchQuestions(), fetchUsers()]);
    } catch (err) {
      showToast(err.response?.data?.error || 'Админ өгөгдөл ачааллахад алдаа', 'err');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleLessonSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingLessonId) {
        await api.put(`/admin/lessons/${editingLessonId}`, lessonForm);
        showToast('Хичээл шинэчлэгдлээ', 'ok');
      } else {
        await api.post('/admin/lessons', lessonForm);
        showToast('Хичээл нэмэгдлээ', 'ok');
      }
      setLessonForm(emptyLesson);
      setEditingLessonId(null);
      await fetchLessons();
    } catch (err) {
      showToast(err.response?.data?.error || 'Хичээл хадгалахад алдаа', 'err');
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...questionForm,
        correctOptionIndex: Number(questionForm.correctOptionIndex),
        points: Number(questionForm.points)
      };
      if (editingQuestionId) {
        await api.put(`/admin/questions/${editingQuestionId}`, payload);
        showToast('Асуулт шинэчлэгдлээ', 'ok');
      } else {
        await api.post('/admin/questions', payload);
        showToast('Асуулт нэмэгдлээ', 'ok');
      }
      setQuestionForm(emptyQuestion);
      setEditingQuestionId(null);
      await fetchQuestions();
    } catch (err) {
      showToast(err.response?.data?.error || 'Асуулт хадгалахад алдаа', 'err');
    } finally {
      setLoading(false);
    }
  };

  const editLesson = (lesson) => {
    setLessonForm({
      title: lesson.title || '',
      moduleSlug: lesson.moduleSlug || 'bukh',
      durationMin: lesson.durationMin || 10,
      level: lesson.level || 'Анхан',
      xpReward: lesson.xpReward || 50,
      content: lesson.content || '',
      description: lesson.description || '',
      isPremium: Boolean(lesson.isPremium)
    });
    setEditingLessonId(lesson._id);
  };

  const editQuestion = (question) => {
    setQuestionForm({
      moduleSlug: question.moduleSlug || 'bukh',
      quizTitle: question.quizTitle || '',
      text: question.text || '',
      options: [...(question.options || []), '', '', '', ''].slice(0, 4),
      correctOptionIndex: question.correctOptionIndex || 0,
      points: question.points || 10,
      explanation: question.explanation || '',
      isPremium: Boolean(question.isPremium)
    });
    setEditingQuestionId(question._id);
  };

  const deleteLesson = async (id) => {
    if (!window.confirm('Энэ хичээлийг устгах уу?')) return;
    await api.delete(`/admin/lessons/${id}`);
    await fetchLessons();
    showToast('Хичээл устгагдлаа', 'ok');
  };

  const deleteQuestion = async (id) => {
    if (!window.confirm('Энэ асуултыг устгах уу?')) return;
    await api.delete(`/admin/questions/${id}`);
    await fetchQuestions();
    showToast('Асуулт устгагдлаа', 'ok');
  };

  const updateQuestionOption = (index, value) => {
    const nextOptions = [...questionForm.options];
    nextOptions[index] = value;
    setQuestionForm({ ...questionForm, options: nextOptions });
  };

  return (
    <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ marginBottom: 18 }}>Админ панель</h1>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {[
          ['lessons', 'Хичээлүүд'],
          ['questions', 'Асуултууд'],
          ['users', 'Хэрэглэгчид']
        ].map(([id, label]) => (
          <button key={id} onClick={() => setActiveTab(id)} style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: activeTab === id ? 'var(--blue)' : 'var(--bg1)', color: activeTab === id ? '#fff' : 'var(--text)', cursor: 'pointer', fontWeight: 700 }}>
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'lessons' && (
        <>
          <div style={{ ...panelStyle, marginBottom: 24 }}>
            <h3>{editingLessonId ? 'Хичээл засварлах' : 'Шинэ хичээл нэмэх'}</h3>
            <form onSubmit={handleLessonSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
              <input name="title" placeholder="Хичээлийн гарчиг" value={lessonForm.title} onChange={e => setLessonForm({ ...lessonForm, title: e.target.value })} required style={fieldStyle} />
              <select value={lessonForm.moduleSlug} onChange={e => setLessonForm({ ...lessonForm, moduleSlug: e.target.value })} style={fieldStyle}>{modules.map(m => <option key={m.slug} value={m.slug}>{m.name}</option>)}</select>
              <input type="number" value={lessonForm.durationMin} onChange={e => setLessonForm({ ...lessonForm, durationMin: e.target.value })} style={fieldStyle} />
              <select value={lessonForm.level} onChange={e => setLessonForm({ ...lessonForm, level: e.target.value })} style={fieldStyle}><option>Анхан</option><option>Дунд</option><option>Ахисан</option></select>
              <input type="number" value={lessonForm.xpReward} onChange={e => setLessonForm({ ...lessonForm, xpReward: e.target.value })} style={fieldStyle} />
              <input placeholder="Богино тайлбар" value={lessonForm.description} onChange={e => setLessonForm({ ...lessonForm, description: e.target.value })} style={fieldStyle} />
              <label style={{ ...fieldStyle, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontWeight: 700 }}>
                <input type="checkbox" checked={lessonForm.isPremium} onChange={e => setLessonForm({ ...lessonForm, isPremium: e.target.checked })} />
                VIP хичээл
              </label>
              <textarea placeholder="Дэлгэрэнгүй агуулга" value={lessonForm.content} onChange={e => setLessonForm({ ...lessonForm, content: e.target.value })} rows="4" style={{ ...fieldStyle, gridColumn: '1 / -1' }} />
              <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 10 }}>
                <button disabled={loading} style={{ ...fieldStyle, background: 'var(--blue)', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>{editingLessonId ? 'Шинэчлэх' : 'Нэмэх'}</button>
                {editingLessonId && <button type="button" onClick={() => { setLessonForm(emptyLesson); setEditingLessonId(null); }} style={fieldStyle}>Цуцлах</button>}
              </div>
            </form>
          </div>

          <DataTable empty="Хичээл байхгүй байна" columns={['Гарчиг', 'Модуль', 'Төрөл', 'Мин', 'Түвшин', 'XP', 'Үйлдэл']}>
            {lessons.map(lesson => (
              <tr key={lesson._id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={cellStyle}>{lesson.title}</td>
                <td style={cellStyle}>{lesson.moduleSlug}</td>
                <td style={cellStyle}>{lesson.isPremium ? 'VIP' : 'Үнэгүй'}</td>
                <td style={cellStyle}>{lesson.durationMin}</td>
                <td style={cellStyle}>{lesson.level}</td>
                <td style={cellStyle}>{lesson.xpReward}</td>
                <td style={cellStyle}><ActionButtons onEdit={() => editLesson(lesson)} onDelete={() => deleteLesson(lesson._id)} /></td>
              </tr>
            ))}
          </DataTable>
        </>
      )}

      {activeTab === 'questions' && (
        <>
          <div style={{ ...panelStyle, marginBottom: 24 }}>
            <h3>{editingQuestionId ? 'Асуулт засварлах' : 'Шинэ асуулт нэмэх'}</h3>
            <form onSubmit={handleQuestionSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
              <select value={questionForm.moduleSlug} onChange={e => setQuestionForm({ ...questionForm, moduleSlug: e.target.value })} style={fieldStyle}>{modules.map(m => <option key={m.slug} value={m.slug}>{m.name}</option>)}</select>
              <input placeholder="Шалгалтын нэр" value={questionForm.quizTitle} onChange={e => setQuestionForm({ ...questionForm, quizTitle: e.target.value })} style={fieldStyle} />
              <input type="number" min="1" placeholder="Оноо" value={questionForm.points} onChange={e => setQuestionForm({ ...questionForm, points: e.target.value })} style={fieldStyle} />
              <textarea placeholder="Асуултын текст" value={questionForm.text} onChange={e => setQuestionForm({ ...questionForm, text: e.target.value })} required rows="3" style={{ ...fieldStyle, gridColumn: '1 / -1' }} />
              {questionForm.options.map((option, index) => (
                <input key={index} placeholder={`Сонголт ${index + 1}`} value={option} onChange={e => updateQuestionOption(index, e.target.value)} required={index < 2} style={fieldStyle} />
              ))}
              <select value={questionForm.correctOptionIndex} onChange={e => setQuestionForm({ ...questionForm, correctOptionIndex: e.target.value })} style={fieldStyle}>
                {questionForm.options.map((_, index) => <option key={index} value={index}>Зөв хариулт: Сонголт {index + 1}</option>)}
              </select>
              <input placeholder="Тайлбар" value={questionForm.explanation} onChange={e => setQuestionForm({ ...questionForm, explanation: e.target.value })} style={fieldStyle} />
              <label style={{ ...fieldStyle, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontWeight: 700 }}>
                <input type="checkbox" checked={questionForm.isPremium} onChange={e => setQuestionForm({ ...questionForm, isPremium: e.target.checked })} />
                VIP шалгалт
              </label>
              <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 10 }}>
                <button disabled={loading} style={{ ...fieldStyle, background: 'var(--blue)', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>{editingQuestionId ? 'Шинэчлэх' : 'Асуулт нэмэх'}</button>
                {editingQuestionId && <button type="button" onClick={() => { setQuestionForm(emptyQuestion); setEditingQuestionId(null); }} style={fieldStyle}>Цуцлах</button>}
              </div>
            </form>
          </div>

          <DataTable empty="Асуулт байхгүй байна" columns={['Асуулт', 'Модуль', 'Сонголт', 'Зөв', 'Оноо', 'Үйлдэл']}>
            {questions.map(question => (
              <tr key={question._id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={cellStyle}>{question.text}</td>
                <td style={cellStyle}>{question.moduleSlug}</td>
                <td style={cellStyle}>{question.options?.join(' / ')}</td>
                <td style={cellStyle}>{question.options?.[question.correctOptionIndex]}</td>
                <td style={cellStyle}>{question.points}</td>
                <td style={cellStyle}><ActionButtons onEdit={() => editQuestion(question)} onDelete={() => deleteQuestion(question._id)} /></td>
              </tr>
            ))}
          </DataTable>
        </>
      )}

      {activeTab === 'users' && (
        <DataTable empty="Хэрэглэгч байхгүй байна" columns={['Нэр', 'Утас', 'Role', 'XP', 'Streak', 'Бүртгэсэн']}>
          {users.map(user => (
            <tr key={user._id} style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={cellStyle}>{user.fullName || user.shortName}</td>
              <td style={cellStyle}>{user.phone}</td>
              <td style={cellStyle}>{user.role}</td>
              <td style={cellStyle}>{user.totalXp}</td>
              <td style={cellStyle}>{user.streakDays}</td>
              <td style={cellStyle}>{user.createdAt ? new Date(user.createdAt).toLocaleString() : '-'}</td>
            </tr>
          ))}
        </DataTable>
      )}
    </div>
  );
};

const cellStyle = { padding: '12px 8px', verticalAlign: 'top' };

const DataTable = ({ columns, empty, children }) => (
  <div style={panelStyle}>
    {!children || children.length === 0 ? (
      <div style={{ textAlign: 'center', padding: 36, color: 'var(--text3)' }}>{empty}</div>
    ) : (
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 760 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
              {columns.map(col => <th key={col} style={{ padding: '12px 8px' }}>{col}</th>)}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    )}
  </div>
);

const ActionButtons = ({ onEdit, onDelete }) => (
  <div style={{ display: 'flex', gap: 8 }}>
    <button onClick={onEdit} style={{ padding: '6px 10px', background: 'var(--blue)', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Засах</button>
    <button onClick={onDelete} style={{ padding: '6px 10px', background: 'var(--red)', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Устгах</button>
  </div>
);
