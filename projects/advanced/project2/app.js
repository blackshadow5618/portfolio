const { useState } = React;

function SocialMediaApp() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: "John Doe",
      content: "Hello world! This is my first post.",
      likes: 5,
      comments: 2,
    },
    {
      id: 2,
      user: "Jane Smith",
      content: "Beautiful day today! ☀️",
      likes: 12,
      comments: 5,
    },
    {
      id: 3,
      user: "Bob Johnson",
      content: "Just finished an amazing project!",
      likes: 8,
      comments: 3,
    },
  ]);
  const [newPost, setNewPost] = useState("");

  const handlePost = () => {
    if (newPost.trim()) {
      const post = {
        id: posts.length + 1,
        user: "You",
        content: newPost,
        likes: 0,
        comments: 0,
      };
      setPosts([post, ...posts]);
      setNewPost("");
    }
  };

  const handleLike = (id) => {
    setPosts(
      posts.map((post) =>
        post.id === id ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  return (
    <div className="social-app">
      <header>
        <h1>SocialConnect</h1>
      </header>
      <div className="post-form">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="What's on your mind?"
          rows="3"
        />
        <button onClick={handlePost}>Post</button>
      </div>
      <div className="posts">
        {posts.map((post) => (
          <div key={post.id} className="post">
            <div className="post-header">
              <strong>{post.user}</strong>
            </div>
            <div className="post-content">{post.content}</div>
            <div className="post-actions">
              <button onClick={() => handleLike(post.id)}>
                👍 {post.likes} Likes
              </button>
              <span>💬 {post.comments} Comments</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

ReactDOM.render(<SocialMediaApp />, document.getElementById("root"));
