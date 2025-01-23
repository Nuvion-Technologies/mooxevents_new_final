// ServiceService.js
export const ServiceService = {
    getServicesSmall: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          // Simulated service data
          const services = [
            { id: 1, name: 'Web Development', subheading: 'Build your online presence', image: 'https://via.placeholder.com/300x200?text=Web+Development' },
            { id: 2, name: 'SEO Optimization', subheading: 'Improve your search rankings', image: 'https://via.placeholder.com/300x200?text=SEO+Optimization' },
            { id: 3, name: 'Graphic Design', subheading: 'Create stunning visuals', image: 'https://via.placeholder.com/300x200?text=Graphic+Design' },
            { id: 4, name: 'Digital Marketing', subheading: 'Grow your business online', image: 'https://via.placeholder.com/300x200?text=Digital+Marketing' },
            { id: 5, name: 'App Development', subheading: 'Create mobile apps for your business', image: 'https://via.placeholder.com/300x200?text=App+Development' },
            { id: 6, name: 'Content Writing', subheading: 'Engage your audience with quality content', image: 'https://via.placeholder.com/300x200?text=Content+Writing' },
            { id: 7, name: 'Consulting', subheading: 'Expert business advice', image: 'https://via.placeholder.com/300x200?text=Consulting' },
            { id: 8, name: 'Brand Strategy', subheading: 'Define your brand for success', image: 'https://via.placeholder.com/300x200?text=Brand+Strategy' },
            { id: 9, name: 'Social Media Management', subheading: 'Manage your social media presence', image: 'https://via.placeholder.com/300x200?text=Social+Media+Management' },
          ];
  
          resolve(services);
        }, 1000); // Simulate a delay for fetching data
      });
    }
  };
  