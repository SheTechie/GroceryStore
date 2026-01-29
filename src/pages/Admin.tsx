import React, { useRef, useState } from 'react';
import { useProductsContext } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { Category, Product, Unit } from '../types';
import { formatCategoryName, formatCategoryNameShort } from '../utils/formatCategory';
import { useLanguage } from '../context/LanguageContext';
import { formatCurrency } from '../utils/currency';
import './Admin.css';

export const Admin: React.FC = () => {
  const { products, addProduct, deleteProduct, updateProduct } = useProductsContext();
  const { logout } = useAuth();
  const { showPrices, setShowPrices } = useSettings();
  const { t } = useLanguage();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<Partial<Product>>({});
  const [imageInputMode, setImageInputMode] = useState<'url' | 'camera'>('url');
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'staples' as Category,
    description: '',
    image: '',
    inStock: true,
    rating: '',
    quantity: '',
    unit: 'kg' as Unit,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  const categories: Category[] = ['staples', 'pulses', 'spices', 'oil', 'snacks', 'beverages', 'household', 'personal-care', 'miscellaneous'];
  const units: Unit[] = ['kg', 'gram', 'litre', 'ml', 'packet', 'piece', 'dozen', 'box'];
  
  const fallbackImage =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">
         <rect width="100%" height="100%" fill="#f5f5f5"/>
         <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#888" font-family="Arial" font-size="18">
           No Image
         </text>
       </svg>`
    );

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    if (target.src !== fallbackImage) {
      target.src = fallbackImage;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'inStock' ? (e.target as HTMLInputElement).checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCameraFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      setFormData(prev => ({ ...prev, image: result }));
      setErrors(prev => ({ ...prev, image: '' }));
    };
    reader.readAsDataURL(file);
  };
  // (Search API removed)

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = t('admin.validation.name.required');
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = t('admin.validation.price.required');
    }
    if (formData.rating && (parseFloat(formData.rating) < 0 || parseFloat(formData.rating) > 5)) {
      newErrors.rating = t('admin.validation.rating.invalid');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');

    if (!validate()) {
      return;
    }

    addProduct({
      name: formData.name.trim(),
      price: parseFloat(formData.price),
      category: formData.category,
      description: formData.description.trim() || undefined,
      image: formData.image.trim() || undefined,
      inStock: formData.inStock,
      rating: formData.rating ? parseFloat(formData.rating) : undefined,
      quantity: formData.quantity ? parseFloat(formData.quantity) : undefined,
      unit: formData.unit,
    });

    // Reset form
    setFormData({
      name: '',
      price: '',
      category: 'staples',
      description: '',
      image: '',
      inStock: true,
      rating: '',
      quantity: '',
      unit: 'kg',
    });
    setImageInputMode('url');
    setShowAddForm(false);
    setSuccessMessage(t('admin.product.added'));
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleDelete = (id: number) => {
    if (window.confirm(t('admin.delete.confirm'))) {
      deleteProduct(id);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setEditingData({
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description,
      image: product.image,
      inStock: product.inStock,
      rating: product.rating,
      quantity: product.quantity,
      unit: product.unit,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingData({});
  };

  const handleSaveEdit = (id: number) => {
    if (editingData.name && editingData.name.trim() && 
        editingData.price && editingData.price > 0) {
      updateProduct(id, editingData);
      setEditingId(null);
      setEditingData({});
      setSuccessMessage(t('admin.product.added'));
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleEditChange = (field: keyof Product, value: string | number | boolean | Category | Unit | undefined) => {
    setEditingData((prev: Partial<Product>) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <h1>{t('admin.title')}</h1>
          <div className="admin-actions">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="add-product-btn"
            >
              {showAddForm ? t('admin.cancel') : `+ ${t('admin.add.product')}`}
            </button>
            <button onClick={logout} className="logout-btn">
              {t('nav.logout')}
            </button>
          </div>
        </div>

        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}

        <div className="admin-settings-section">
          <h2>{t('admin.settings')}</h2>
          <div className="settings-card">
            <div className="setting-item">
              <div className="setting-info">
                <label htmlFor="show-prices-toggle" className="setting-label">
                  {t('admin.show.prices')}
                </label>
                <p className="setting-description">{t('admin.show.prices.description')}</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  id="show-prices-toggle"
                  checked={showPrices}
                  onChange={(e) => setShowPrices(e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        {showAddForm && (
          <div className="add-product-form-container">
            <h2>{t('admin.add.product')}</h2>
            <form onSubmit={handleSubmit} className="add-product-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">{t('admin.product.name')} *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? 'error' : ''}
                    placeholder="e.g., Fresh Oranges"
                  />
                  {errors.name && <span className="error-text">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="category">{t('admin.category')} *</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {formatCategoryNameShort(cat)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="price">{t('admin.price')} (₹) *</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className={errors.price ? 'error' : ''}
                    placeholder="0.00"
                  />
                  {errors.price && <span className="error-text">{errors.price}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="rating">{t('admin.rating')}</label>
                  <input
                    type="number"
                    id="rating"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    step="0.1"
                    min="0"
                    max="5"
                    className={errors.rating ? 'error' : ''}
                    placeholder="4.5"
                  />
                  {errors.rating && <span className="error-text">{errors.rating}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="quantity">{t('admin.quantity')}</label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    placeholder="e.g., 1, 0.5, 2"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="unit">{t('admin.unit')}</label>
                  <select
                    id="unit"
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                  >
                    {units.map(unit => (
                      <option key={unit} value={unit}>
                        {t(`unit.${unit}`)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>{t('admin.image.url')}</label>

                <div className="image-mode-toggle">
                  <button
                    type="button"
                    className={`image-mode-btn ${imageInputMode === 'url' ? 'active' : ''}`}
                    onClick={() => {
                      setImageInputMode('url');
                    }}
                  >
                    URL
                  </button>
                  <button
                    type="button"
                    className={`image-mode-btn ${imageInputMode === 'camera' ? 'active' : ''}`}
                    onClick={() => {
                      setImageInputMode('camera');
                    }}
                  >
                    Camera / Upload
                  </button>
                </div>

                {imageInputMode === 'url' ? (
                  <input
                    type="url"
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className={errors.image ? 'error' : ''}
                    placeholder="https://example.com/image.jpg"
                  />
                ) : (
                  <div className="image-upload-row">
                    <input
                      ref={cameraInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleCameraFile}
                      className="image-file-input"
                    />
                    {formData.image && (
                      <img 
                        className="image-preview" 
                        src={formData.image} 
                        alt="Preview" 
                        onError={handleImageError}
                      />
                    )}
                  </div>
                )}

                {errors.image && <span className="error-text">{errors.image}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="description">{t('admin.description')}</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className={errors.description ? 'error' : ''}
                  placeholder="Product description..."
                />
                {errors.description && <span className="error-text">{errors.description}</span>}
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="inStock"
                    checked={formData.inStock}
                    onChange={handleChange}
                  />
                  {t('admin.in.stock')}
                </label>
              </div>

              <button type="submit" className="submit-btn">
                {t('admin.add')}
              </button>
            </form>
          </div>
        )}

        <div className="products-list-section">
          <h2>{t('admin.all.products')} ({products.length})</h2>
          <div className="products-table-container">
            <table className="products-table">
              <thead>
                <tr>
                  <th>{t('admin.id')}</th>
                  <th>{t('admin.product.name')}</th>
                  <th>{t('admin.category')}</th>
                  <th>{t('admin.price')}</th>
                  <th>{t('admin.quantity')}</th>
                  <th>{t('admin.unit')}</th>
                  <th>{t('admin.description')}</th>
                  <th>{t('admin.stock')}</th>
                  <th>{t('admin.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => {
                  const isEditing = editingId === product.id;
                  const displayData = isEditing ? editingData : product;
                  
                  return (
                    <tr key={product.id} className={isEditing ? 'editing-row' : ''}>
                      <td>{product.id}</td>
                      <td>
                        {isEditing ? (
                          <input
                            type="text"
                            value={displayData.name || ''}
                            onChange={(e) => handleEditChange('name', e.target.value)}
                            className="edit-input"
                          />
                        ) : (
                          product.name
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <select
                            value={displayData.category || 'staples'}
                            onChange={(e) => handleEditChange('category', e.target.value as Category)}
                            className="edit-select"
                          >
                            {categories.map(cat => (
                              <option key={cat} value={cat}>
                                {formatCategoryNameShort(cat)}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className="category-badge">{formatCategoryName(product.category)}</span>
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <input
                            type="number"
                            value={displayData.price || ''}
                            onChange={(e) => handleEditChange('price', parseFloat(e.target.value) || 0)}
                            step="0.01"
                            min="0"
                            className="edit-input"
                          />
                        ) : (
                          formatCurrency(product.price)
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <input
                            type="number"
                            value={displayData.quantity || ''}
                            onChange={(e) => handleEditChange('quantity', parseFloat(e.target.value) || undefined)}
                            step="0.01"
                            min="0"
                            className="edit-input"
                            placeholder="Qty"
                          />
                        ) : (
                          <span>{product.quantity || '-'}</span>
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <select
                            value={displayData.unit || 'kg'}
                            onChange={(e) => handleEditChange('unit', e.target.value as Unit)}
                            className="edit-select"
                          >
                            {units.map(unit => (
                              <option key={unit} value={unit}>
                                {t(`unit.${unit}`)}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span>{product.unit ? t(`unit.${product.unit}`) : '-'}</span>
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <textarea
                            value={displayData.description || ''}
                            onChange={(e) => handleEditChange('description', e.target.value)}
                            className="edit-textarea"
                            rows={2}
                          />
                        ) : (
                          <span className="description-cell" title={product.description || ''}>
                            {(() => {
                              const desc = product.description || '';
                              if (!desc) return t('product.no.description');
                              return desc.length > 30 ? `${desc.substring(0, 30)}...` : desc;
                            })()}
                          </span>
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <select
                            value={displayData.inStock ? 'true' : 'false'}
                            onChange={(e) => handleEditChange('inStock', e.target.value === 'true')}
                            className="edit-select stock-select"
                          >
                            <option value="true">{t('admin.in.stock')}</option>
                            <option value="false">{t('product.out.of.stock')}</option>
                          </select>
                        ) : (
                          <span className={product.inStock ? 'in-stock' : 'out-of-stock'}>
                            {product.inStock ? `✓ ${t('admin.in.stock')}` : `✗ ${t('product.out.of.stock')}`}
                          </span>
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <div className="edit-actions">
                            <button
                              onClick={() => handleSaveEdit(product.id)}
                              className="icon-btn icon-save"
                              aria-label={t('admin.save') || 'Save'}
                              title={t('admin.save') || 'Save'}
                            >
                              <svg viewBox="0 0 24 24" className="icon" aria-hidden="true">
                                <path
                                  d="M17 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7l-4-4ZM7 5h8v4H7V5Zm5 14a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"
                                  fill="currentColor"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="icon-btn icon-cancel"
                              aria-label={t('admin.cancel') || 'Cancel'}
                              title={t('admin.cancel') || 'Cancel'}
                            >
                              <svg viewBox="0 0 24 24" className="icon" aria-hidden="true">
                                <path
                                  d="M18.3 5.71 12 12l6.3 6.29-1.41 1.42L12 13.41l-4.89 6.3-1.42-1.41L10.59 12 5.69 7.11l1.42-1.4L12 10.59l4.89-4.88 1.41 1.4Z"
                                  fill="currentColor"
                                />
                              </svg>
                            </button>
                          </div>
                        ) : (
                          <div className="action-buttons">
                            <button
                              onClick={() => handleEdit(product)}
                              className="icon-btn icon-edit"
                              aria-label={t('admin.edit') || 'Edit'}
                              title={t('admin.edit') || 'Edit'}
                            >
                              <svg viewBox="0 0 24 24" className="icon" aria-hidden="true">
                                <path
                                  d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25Zm18.71-11.04a1 1 0 0 0 0-1.41l-2.5-2.5a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.99-1.67Z"
                                  fill="currentColor"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="icon-btn icon-delete"
                              aria-label={t('admin.delete') || 'Delete'}
                              title={t('admin.delete') || 'Delete'}
                            >
                              <svg viewBox="0 0 24 24" className="icon" aria-hidden="true">
                                <path
                                  d="M6 7h12l-1 14H7L6 7Zm3-3h6l1 2H8l1-2Zm-5 2h16v2H4V6Z"
                                  fill="currentColor"
                                />
                              </svg>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
