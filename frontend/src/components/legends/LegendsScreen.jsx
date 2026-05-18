import { Icon } from '../common/Icon';

export const LegendsScreen = ({ showToast, isVip, openPay }) => {
  const legends = [
    { name: 'Батсуурь Батбаяр', role: 'Дархан Аварга Бөх', desc: 'Улсын наадмын 7 дахь удаагийн аварга. 30 жилийн туршлага.', icon: 'trophy', color: 'var(--blue)', tag: 'Бөх', status: 'open', statusText: 'Нээлттэй', free: true },
    { name: 'Цэндаюуш Цэрэнжав', role: 'Тод Манлай Уяач', desc: 'Наадмын 12 дахь удаагийн шилдэг уяач.', icon: 'route', color: 'var(--amber)', tag: 'Морь', status: 'soon', statusText: '2 долоо хоног', free: true },
    { name: 'Дорж Балдандорж', role: 'Мянгат Малчин', desc: 'Ховд аймгийн тэргүүлэх малчин.', icon: 'layers', color: 'var(--green)', tag: 'Мал', status: 'locked', statusText: 'Шалгалт 90%+', locked: true },
    { name: 'Проф. Тэрбиш', role: 'Бичгийн Профессор', desc: 'МУИС-ийн хэл шинжлэлийн тэнхимийн эрхлэгч.', icon: 'star', color: '#7c3aed', tag: 'Бичиг', status: 'vip', statusText: 'VIP шаардлагатай', vip: true }
  ];

  const statusColors = { open: 'var(--green)', soon: 'var(--amber)', locked: 'var(--text3)', vip: 'var(--amber)' };

  return (
    <div style={{ padding: '28px 32px' }}>
      <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Домогт Уулзалт</div>
      <div style={{ fontSize: 14, color: 'var(--text3)', marginBottom: 20 }}>Шилдгүүдтэй амьдаар уулзах боломж</div>

      <div style={{ background: 'var(--card)', borderRadius: 18, padding: '18px 22px', marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span>Том шалгалт — тэнцвэл нэвтэрнэ</span>
          <span style={{ color: 'var(--blue)' }}>78%</span>
        </div>
        <div style={{ height: 8, background: 'var(--bg2)', borderRadius: 4, marginBottom: 6 }}>
          <div style={{ width: '78%', height: '100%', background: 'linear-gradient(90deg,var(--blue),var(--blue2))' }} />
        </div>
        <div style={{ fontSize: 12, color: 'var(--text3)' }}>22 оноо дутуу байна</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
        {legends.map((l, i) => (
          <div key={i} onClick={() => {
            if (l.vip) { if (isVip) showToast('VIP уулзалтын цаг захиалга илгээгдлээ', 'info'); else openPay(); }
            else if (l.locked) showToast('Малын шалгалт 90%+ дүүргэнэ үү', 'err');
            else if (l.status === 'soon') showToast('2 долоо хоногийн дараа', 'info');
            else showToast('Бүртгэл амжилттай!', 'ok');
          }} style={{ background: 'var(--card)', borderRadius: 20, overflow: 'hidden', cursor: 'pointer', opacity: (l.locked || (l.vip && !isVip)) ? 0.65 : 1 }}>
            <div style={{ display: 'flex', gap: 14, padding: '20px' }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: 'var(--blue-lt)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: l.color }}>
                <Icon name={l.icon} size={26} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15 }}>{l.name}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text3)' }}>{l.role}</div>
                <div style={{ fontSize: 13, color: 'var(--text2)' }}>{l.desc}</div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 20px', borderTop: '1px solid var(--border)', background: 'var(--bg1)' }}>
              <span style={{ background: 'var(--blue-lt)', color: 'var(--blue)', padding: '3px 8px', borderRadius: 20, fontSize: 11 }}>
                <Icon name={l.icon} size={10} /> {l.tag}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: statusColors[l.status] }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: statusColors[l.status] }} />{l.statusText}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};