import React, { useState } from 'react';

const styles = {
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    maxWidth: 900,
    margin: 'auto',
    padding: 20,
    backgroundColor: '#fafafa',
    borderRadius: 8,
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  banner: {
    width: '100%',
    height: 180,
    backgroundImage: 'url(https://via.placeholder.com/900x180?text=Bannière+de+chaîne)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: '8px 8px 0 0',
    position: 'relative',
  },
  editBannerBtn: {
    position: 'absolute',
    right: 20,
    bottom: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    color: 'white',
    border: 'none',
    padding: '6px 14px',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: 14,
  },
  profileSection: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 20px',
    marginTop: -60,
  },
  profileImageWrapper: {
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: '50%',
    border: '4px solid white',
    objectFit: 'cover',
    backgroundColor: '#ddd',
  },
  editProfileBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#cc0000',
    border: 'none',
    borderRadius: '50%',
    color: 'white',
    width: 28,
    height: 28,
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: 18,
    lineHeight: '28px',
    textAlign: 'center',
  },
  channelInfo: {
    marginLeft: 20,
    flexGrow: 1,
  },
  channelName: {
    margin: 0,
    fontSize: 28,
    fontWeight: 700,
    color: '#222',
  },
  channelHandle: {
    margin: '4px 0',
    color: '#555',
    fontSize: 16,
  },
  channelDescription: {
    color: '#666',
    fontSize: 14,
    marginTop: 8,
    maxWidth: 500,
  },
  buttonsGroup: {
    display: 'flex',
    gap: 12,
  },
  ownerButton: {
    backgroundColor: '#444',
    color: 'white',
    border: 'none',
    borderRadius: 4,
    padding: '8px 16px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  ownerButtonHover: {
    backgroundColor: '#222',
  },
  tabsBar: {
    display: 'flex',
    borderBottom: '1px solid #ddd',
    marginTop: 24,
  },
  tabButton: (active) => ({
    padding: '14px 24px',
    cursor: 'pointer',
    border: 'none',
    background: 'none',
    fontWeight: active ? '700' : '400',
    borderBottom: active ? '3px solid #cc0000' : '3px solid transparent',
    transition: 'border-bottom 0.2s ease',
    color: active ? '#cc0000' : '#555',
  }),
  contentSection: {
    paddingTop: 20,
  },
  videoCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    boxShadow: '0 1px 4px rgb(0 0 0 / 0.1)',
    cursor: 'pointer',
    overflow: 'hidden',
    width: 220,
    marginBottom: 20,
  },
  videoThumbnail: {
    width: '100%',
    display: 'block',
  },
  videoTitle: {
    margin: 8,
    fontSize: 16,
    fontWeight: 600,
    color: '#222',
  },
  gridVideos: {
    display: 'flex',
    gap: 16,
    flexWrap: 'wrap',
  },
  postSection: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    boxShadow: '0 1px 8px rgba(0,0,0,0.1)',
    maxWidth: 600,
    marginTop: 20,
  },
  postInput: {
    width: '100%',
    minHeight: 80,
    padding: 10,
    fontSize: 16,
    borderRadius: 6,
    border: '1px solid #ccc',
    resize: 'vertical',
    fontFamily: 'inherit',
    marginBottom: 12,
  },
  postButtonsRow: {
    display: 'flex',
    gap: 12,
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  postTypeBtn: {
    padding: '8px 14px',
    backgroundColor: '#eee',
    border: '1px solid #ccc',
    borderRadius: 6,
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 14,
  },
  publishBtn: {
    backgroundColor: '#cc0000',
    color: 'white',
    border: 'none',
    borderRadius: 6,
    padding: '10px 18px',
    fontWeight: 700,
    cursor: 'pointer',
    fontSize: 16,
    width: '100%',
  },
  postsList: {
    marginTop: 20,
  },
  postItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    padding: 14,
    marginBottom: 12,
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
  },
};

const sampleVideos = [
  { id: 1, title: "Ma première vidéo", thumbnail: "https://via.placeholder.com/320x180?text=Vidéo+1" },
  { id: 2, title: "Tutoriel React", thumbnail: "https://via.placeholder.com/320x180?text=Vidéo+2" },
  { id: 3, title: "Unboxing tech", thumbnail: "https://via.placeholder.com/320x180?text=Vidéo+3" },
];

const ChannelPage = () => {
  const [activeTab, setActiveTab] = useState('videos');
  const [postText, setPostText] = useState('');
  const [postType, setPostType] = useState('texte'); // texte, image, sondage, quiz, video
  const [posts, setPosts] = useState([]);

  // Fonction pour publier un post (ajoute à la liste)
  const publishPost = () => {
    if (!postText.trim()) return alert("Écris quelque chose pour publier !");
    setPosts([{ id: Date.now(), type: postType, content: postText }, ...posts]);
    setPostText('');
  };

  return (
    <div style={styles.container}>
      {/* Bannière */}
      <div style={styles.banner}>
        <button style={styles.editBannerBtn}>Modifier la bannière</button>
      </div>

      {/* Section profil */}
      <div style={styles.profileSection}>
        <div style={styles.profileImageWrapper}>
          <img
            src="https://via.placeholder.com/120"
            alt="Photo de profil"
            style={styles.profileImage}
          />
          <button style={styles.editProfileBtn} title="Modifier la photo de profil">✏️</button>
        </div>
        <div style={styles.channelInfo}>
          <h1 style={styles.channelName}>Eldo-Moréo GBOHOUILI</h1>
          <div style={styles.channelHandle}>@eldo-moreogbohouili1397</div>
          <div style={styles.channelDescription}>
            En savoir plus sur cette chaîne
          </div>
        </div>
        <div style={styles.buttonsGroup}>
          <button style={styles.ownerButton} title="Personnaliser la chaîne">Personnaliser la chaîne</button>
          <button style={styles.ownerButton} title="Gérer les vidéos">Gérer les vidéos</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabsBar}>
        <button
          style={styles.tabButton(activeTab === 'videos')}
          onClick={() => setActiveTab('videos')}
        >
          Vidéos
        </button>
        <button
          style={styles.tabButton(activeTab === 'playlists')}
          onClick={() => setActiveTab('playlists')}
        >
          Playlists
        </button>
        <button
          style={styles.tabButton(activeTab === 'posts')}
          onClick={() => setActiveTab('posts')}
        >
          Posts
        </button>
      </div>

      {/* Contenu dynamique selon onglet */}
      <div style={styles.contentSection}>
        {activeTab === 'videos' && (
          <div style={styles.gridVideos}>
            {sampleVideos.map(video => (
              <div key={video.id} style={styles.videoCard}>
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  style={styles.videoThumbnail}
                />
                <h4 style={styles.videoTitle}>{video.title}</h4>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'playlists' && (
          <div>
            <h3>Playlists</h3>
            <p>Pas encore de playlists, contenu à venir.</p>
          </div>
        )}

        {activeTab === 'posts' && (
          <div>
            {/* Formulaire publication post */}
            <div style={styles.postSection}>
              <h3>Publier un post</h3>
              <textarea
                placeholder="Offrez un bref aperçu de votre prochaine vidéo"
                style={styles.postInput}
                value={postText}
                onChange={e => setPostText(e.target.value)}
              />

              <div style={styles.postButtonsRow}>
                <button
                  style={{
                    ...styles.postTypeBtn,
                    backgroundColor: postType === 'texte' ? '#cc0000' : '#eee',
                    color: postType === 'texte' ? 'white' : 'black',
                  }}
                  onClick={() => setPostType('texte')}
                >
                  Texte
                </button>
                <button
                  style={{
                    ...styles.postTypeBtn,
                    backgroundColor: postType === 'image' ? '#cc0000' : '#eee',
                    color: postType === 'image' ? 'white' : 'black',
                  }}
                  onClick={() => setPostType('image')}
                >
                  Image
                </button>
                <button
                  style={{
                    ...styles.postTypeBtn,
                    backgroundColor: postType === 'sondage' ? '#cc0000' : '#eee',
                    color: postType === 'sondage' ? 'white' : 'black',
                  }}
                  onClick={() => setPostType('sondage')}
                >
                  Sondage
                </button>
                <button
                  style={{
                    ...styles.postTypeBtn,
                    backgroundColor: postType === 'quiz' ? '#cc0000' : '#eee',
                    color: postType === 'quiz' ? 'white' : 'black',
                  }}
                  onClick={() => setPostType('quiz')}
                >
                  Quiz
                </button>
                <button
                  style={{
                    ...styles.postTypeBtn,
                    backgroundColor: postType === 'video' ? '#cc0000' : '#eee',
                    color: postType === 'video' ? 'white' : 'black',
                  }}
                  onClick={() => setPostType('video')}
                >
                  Vidéo
                </button>
              </div>

              <button style={styles.publishBtn} onClick={publishPost}>
                Publier
              </button>
            </div>

            {/* Liste des posts publiés */}
            <div style={styles.postsList}>
              {posts.length === 0 && (
                <p>Vos posts s'affichent ici une fois publiés et votre communauté peut les voir.</p>
              )}

              {posts.map(post => (
                <div key={post.id} style={styles.postItem}>
                  <strong>Type:</strong> {post.type.charAt(0).toUpperCase() + post.type.slice(1)} <br />
                  <p>{post.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChannelPage;
