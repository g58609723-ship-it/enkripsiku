export default function AboutPanel() {
  return (
    <div>
      <div className="retro-about-box">
        <h3><i className="fas fa-shield-halved"></i> TENTANG ENKRIPSI-KU v2</h3>
        <p>
          <span style={{ color: '#00ff41' }}>Enkripsi-Ku v2</span> adalah web app 8-bit retro untuk mengobfuskasi kode JavaScript.
          Versi ini sudah <strong style={{ color: '#ff00ff' }}>TANPA js-confuser</strong> — semua engine enkripsi pure custom buatan Primrosereyy.
        </p>
        <p>Fitur utama:</p>
        <ul>
          <li><i className="fas fa-check"></i> 11 tipe enkripsi (10 lama + 1 baru: customname)</li>
          <li><i className="fas fa-check"></i> Custom Name: base64 chunks diselipin di akhir custom name</li>
          <li><i className="fas fa-check"></i> Decoder di TENGAH file, di-encrypt dengan cara lama</li>
          <li><i className="fas fa-check"></i> Decoder baca ID (indexOf), BUKAN regex</li>
          <li><i className="fas fa-check"></i> Sistem login & credits (jsonbin.io)</li>
          <li><i className="fas fa-check"></i> Plan: Free, Premium, Max</li>
        </ul>
        <p style={{ color: '#666', fontSize: '7px', marginTop: '12px' }}>
          * Untuk hasil maksimal, gunakan file .js murni tanpa export ES6 module.
        </p>
      </div>

      <div className="retro-about-box">
        <h3><i className="fas fa-user-astronaut"></i> TENTANG DEVELOPER</h3>
        <p>
          <span style={{ color: '#ff00ff' }}>Primrosereyy</span> adalah developer & creator asli.
          Dikenal juga sebagai <span style={{ color: '#00ff41' }}>Reyy</span> di komunitas.
        </p>
        <p>Support & Best Friends:</p>
        <div style={{ margin: '8px 0' }}>
          <span className="retro-tag"><i className="fas fa-heart"></i> Than XS #BestFriend</span>
          <span className="retro-tag"><i className="fas fa-heart"></i> Daffa #BestFriend</span>
          <span className="retro-tag"><i className="fas fa-heart"></i> Rapli #BestFriend</span>
          <span className="retro-tag"><i className="fas fa-heart"></i> Rapipp #BestFriend</span>
          <span className="retro-tag"><i className="fas fa-heart"></i> Drayy #BestFriend</span>
        </div>
        <p>Contact:</p>
        <ul>
          <li><i className="fas fa-bullhorn"></i> Channel: @rreyy1st</li>
          <li><i className="fas fa-paper-plane"></i> Telegram: @xberlianmine</li>
          <li><i className="fas fa-robot"></i> Bot: @reyyobfuscation_bot</li>
        </ul>
        <p style={{ color: '#ff00ff', fontSize: '8px', marginTop: '12px' }}>
          // Encrypt By: Primrosereyy ^~^ // v2.0 NO js-confuser
        </p>
      </div>
    </div>
  );
}
