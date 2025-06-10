'use client'
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Loading from "@/components/Loading";

const BannerManagement = () => {
  const { router } = useAppContext();
  const [activeTab, setActiveTab] = useState('view');
  const [editingId, setEditingId] = useState(null);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    offerText: '',
    isActive: true,
    order: 0,
    buttons: [{ text: 'Shop Now', link: '/products', variant: 'primary' }]
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState('');

  const fetchBanners = async () => {
    try {
      const response = await fetch("http://localhost:5070/api/sliders");
      if (!response.ok) throw new Error("Failed to fetch banners");
      const data = await response.json();
      setBanners(data);
    } catch (error) {
      console.error("Error fetching banners:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const loadBannerForEdit = (banner) => {
    setEditingId(banner._id);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || '',
      offerText: banner.offerText || '',
      isActive: banner.isActive,
      order: banner.order,
      buttons: banner.buttons.length > 0 ? banner.buttons : [{ text: 'Shop Now', link: '/products', variant: 'primary' }]
    });
    setPreviewImage(banner.imageUrl);
    setActiveTab('edit');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleButtonChange = (index, field, value) => {
    const updatedButtons = [...formData.buttons];
    updatedButtons[index][field] = value;
    setFormData(prev => ({ ...prev, buttons: updatedButtons }));
  };

  const addButton = () => {
    setFormData(prev => ({
      ...prev,
      buttons: [...prev.buttons, { text: '', link: '', variant: 'primary' }]
    }));
  };

  const removeButton = (index) => {
    const updatedButtons = [...formData.buttons];
    updatedButtons.splice(index, 1);
    setFormData(prev => ({ ...prev, buttons: updatedButtons }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      offerText: '',
      isActive: true,
      order: 0,
      buttons: [{ text: 'Shop Now', link: '/products', variant: 'primary' }]
    });
    setSelectedFile(null);
    setPreviewImage('');
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('subtitle', formData.subtitle);
    formDataToSend.append('offerText', formData.offerText);
    formDataToSend.append('isActive', formData.isActive);
    formDataToSend.append('order', formData.order);
    formDataToSend.append('buttons', JSON.stringify(formData.buttons));
    if (selectedFile) formDataToSend.append('image', selectedFile);

    try {
      const url = editingId 
        ? `http://localhost:5070/api/sliders/${editingId}`
        : "http://localhost:5070/api/sliders";
      
      const method = editingId ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        body: formDataToSend
      });

      if (!response.ok) throw new Error(`Failed to ${editingId ? 'update' : 'create'} banner`);
      
      const result = await response.json();
      
      if (editingId) {
        setBanners(prev => prev.map(b => b._id === editingId ? result : b));
      } else {
        setBanners(prev => [...prev, result]);
      }
      
      setActiveTab('view');
      resetForm();
    } catch (error) {
      console.error(`Error ${editingId ? 'updating' : 'creating'} banner:`, error);
    } finally {
      setLoading(false);
    }
  };

  const deleteBanner = async (id) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;
    
    try {
      const response = await fetch(`http://localhost:5070/api/sliders/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error("Failed to delete banner");
      
      setBanners(prev => prev.filter(banner => banner._id !== id));
    } catch (error) {
      console.error("Error deleting banner:", error);
    }
  };

  return (
    <div className="flex-1 min-h-screen flex flex-col">
      <div className="w-full md:p-10 p-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium">Banner Management</h2>
          <div className="flex border border-gray-300 rounded-md overflow-hidden">
            <button
              className={`px-4 py-2 ${activeTab === 'view' ? 'bg-orange-600 text-white' : 'bg-white'}`}
              onClick={() => {
                setActiveTab('view');
                resetForm();
              }}
            >
              View Banners
            </button>
            <button
              className={`px-4 py-2 ${activeTab === 'add' ? 'bg-orange-600 text-white' : 'bg-white'}`}
              onClick={() => {
                setActiveTab('add');
                resetForm();
              }}
            >
              Add Banner
            </button>
          </div>
        </div>

        {loading ? (
          <Loading />
        ) : activeTab === 'view' ? (
          <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
            <table className="table-fixed w-full overflow-hidden">
              <thead className="text-gray-900 text-sm text-left">
                <tr>
                  <th className="w-2/5 px-4 py-3 font-medium truncate">Banner</th>
                  <th className="px-4 py-3 font-medium truncate">Title</th>
                  <th className="px-4 py-3 font-medium truncate">Status</th>
                  <th className="px-4 py-3 font-medium truncate">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-500">
                {banners.map((banner) => (
                  <tr key={banner._id} className="border-t border-gray-500/20">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="bg-gray-500/10 rounded p-2">
                          <img
                            src={banner.imageUrl}
                            alt="banner"
                            className="w-16 h-10 object-cover"
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 truncate">{banner.title}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${banner.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {banner.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 space-x-2">
                      <button 
                        onClick={() => loadBannerForEdit(banner)}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => deleteBanner(banner._id)}
                        className="px-2 py-1 bg-red-100 text-red-800 rounded-md text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-md border border-gray-500/20 p-6 max-w-4xl">
            <h3 className="text-lg font-medium mb-4">
              {editingId ? 'Edit Banner' : 'Add New Banner'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title*</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                    <input
                      type="text"
                      name="subtitle"
                      value={formData.subtitle}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Offer Text</label>
                    <input
                      type="text"
                      name="offerText"
                      value={formData.offerText}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                    <input
                      type="number"
                      name="order"
                      value={formData.order}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">Active Banner</label>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Banner Image{!editingId ? '*' : ''}
                    </label>
                    <div className="mt-1 flex items-center">
                      <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md border border-gray-300">
                        Choose File
                        <input
                          type="file"
                          onChange={handleFileChange}
                          className="hidden"
                          accept="image/*"
                          required={!editingId && !previewImage}
                        />
                      </label>
                      {selectedFile && (
                        <span className="ml-2 text-sm text-gray-500">{selectedFile.name}</span>
                      )}
                    </div>
                    {(previewImage || (editingId && !selectedFile)) && (
                      <div className="mt-4">
                        <img
                          src={previewImage || formData.imageUrl}
                          alt="Preview"
                          className="h-40 object-contain border rounded-md"
                        />
                        {editingId && !selectedFile && (
                          <p className="text-xs text-gray-500 mt-1">Current image will be kept if no new file is selected</p>
                        )}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Buttons</label>
                    <div className="space-y-2">
                      {formData.buttons.map((button, index) => (
                        <div key={index} className="border p-3 rounded-md">
                          <div className="grid grid-cols-2 gap-2 mb-2">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Text</label>
                              <input
                                type="text"
                                value={button.text}
                                onChange={(e) => handleButtonChange(index, 'text', e.target.value)}
                                className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Link</label>
                              <input
                                type="text"
                                value={button.link}
                                onChange={(e) => handleButtonChange(index, 'link', e.target.value)}
                                className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                                required
                              />
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Variant</label>
                              <select
                                value={button.variant}
                                onChange={(e) => handleButtonChange(index, 'variant', e.target.value)}
                                className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                              >
                                <option value="primary">Primary</option>
                                <option value="secondary">Secondary</option>
                              </select>
                            </div>
                            {formData.buttons.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeButton(index)}
                                className="text-red-500 text-xs"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addButton}
                        className="text-orange-600 text-sm mt-2"
                      >
                        + Add Another Button
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('view');
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 text-white rounded-md text-sm font-medium"
                >
                  {editingId ? 'Update Banner' : 'Save Banner'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default BannerManagement;