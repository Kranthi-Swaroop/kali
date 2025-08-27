// API utility for frontend integration
// Add this to your React app to connect with the backend

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  // Generic API call method
  async apiCall(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }
      
      return data;
    } catch (error) {
      console.error(`API call failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    return this.apiCall('/health');
  }

  // Team API methods
  async getAllTeamMembers() {
    return this.apiCall('/team');
  }

  async getTeamMember(id) {
    return this.apiCall(`/team/${id}`);
  }

  async addTeamMember(memberData) {
    return this.apiCall('/team', {
      method: 'POST',
      body: JSON.stringify(memberData)
    });
  }

  // Project API methods
  async getAllProjects(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = queryParams ? `/projects?${queryParams}` : '/projects';
    return this.apiCall(endpoint);
  }

  async getProject(id) {
    return this.apiCall(`/projects/${id}`);
  }

  async getProjectCategories() {
    return this.apiCall('/projects/meta/categories');
  }

  async addProject(projectData) {
    return this.apiCall('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData)
    });
  }

  // Blog API methods
  async getAllBlogs(options = {}) {
    const queryParams = new URLSearchParams(options).toString();
    const endpoint = queryParams ? `/blogs?${queryParams}` : '/blogs';
    return this.apiCall(endpoint);
  }

  async getBlogPost(slug) {
    return this.apiCall(`/blogs/${slug}`);
  }

  async getBlogCategories() {
    return this.apiCall('/blogs/meta/categories');
  }

  async getBlogTags() {
    return this.apiCall('/blogs/meta/tags');
  }

  // Contact API methods
  async submitContactForm(contactData) {
    return this.apiCall('/contact', {
      method: 'POST',
      body: JSON.stringify(contactData)
    });
  }

  async getContactInfo() {
    return this.apiCall('/contact/info');
  }

  // Admin methods (require authentication in real app)
  async getContactSubmissions(options = {}) {
    const queryParams = new URLSearchParams(options).toString();
    const endpoint = queryParams ? `/contact/submissions?${queryParams}` : '/contact/submissions';
    return this.apiCall(endpoint);
  }

  async updateSubmissionStatus(id, status) {
    return this.apiCall(`/contact/submissions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;

// Example usage in React components:
/*
import apiService from './api/apiService';

function TeamComponent() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTeam() {
      try {
        setLoading(true);
        const response = await apiService.getAllTeamMembers();
        setTeamMembers(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTeam();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {teamMembers.map(member => (
        <div key={member.id}>{member.name} - {member.role}</div>
      ))}
    </div>
  );
}

// For contact form:
async function handleContactSubmit(formData) {
  try {
    const response = await apiService.submitContactForm(formData);
    alert(response.message); // "Thank you for your message! We will get back to you soon."
  } catch (error) {
    alert('Failed to submit form: ' + error.message);
  }
}

// For projects with filtering:
const projectsResponse = await apiService.getAllProjects({ 
  category: 'Security', 
  status: 'Active' 
});

// For blog posts with pagination:
const blogsResponse = await apiService.getAllBlogs({ 
  page: 1, 
  limit: 10, 
  featured: 'true' 
});
*/
