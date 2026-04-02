import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Html5Qrcode } from 'html5-qrcode';
import { 
  Camera, Package, MapPin, AlertCircle, CheckCircle, 
  Plus, Minus, Search, History, X, RefreshCw
} from 'lucide-react';

// YOUR SUPABASE CREDENTIALS
const supabase = createClient(
  'https://byuthzcoyatbnycsanni.supabase.co',
  'sb_publishable_dhDOyqrVd1CZcj96_PPriA_rfeF4Y8-'
);

export default function InventoryApp() {
  const [items, setItems] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('Broadway Office');
  const [view, setView] = useState('scan');
  const [scanning, setScanning] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState(null);
  const [dispensingItem, setDispensingItem] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const html5QrCodeRef = useRef(null);
  const scannerInitialized = useRef(false);

  useEffect(() => {
    loadItems();
  }, [selectedLocation]);

  const loadItems = async () => {
    try {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('location', selectedLocation)
        .order('name');

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error loading items:', error);
      showNotification('Failed to load inventory', 'error');
    }
  };

  const startScanning = async () => {
    try {
      setScanning(true);
      
      if (!scannerInitialized.current) {
        html5QrCodeRef.current = new Html5Qrcode("qr-reader");
        scannerInitialized.current = true;
      }

      await html5QrCodeRef.current.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => handleBarcodeDetected(decodedText),
        () => {}
      );
    } catch (error) {
      console.error('Camera error:', error);
      showNotification('Camera access denied', 'error');
      setScanning(false);
    }
  };

  const stopScanning = async () => {
    try {
      if (html5QrCodeRef.current && scanning) {
        await html5QrCodeRef.current.stop();
      }
    } catch (error) {
      console.error('Error stopping scanner:', error);
    } finally {
      setScanning(false);
    }
  };

  const handleBarcodeDetected = async (barcode) => {
    await stopScanning();
    const item = items.find(i => i.item_id === barcode);
    
    if (item) {
      setDispensingItem(item);
      showNotification(`Found: ${item.name}`, 'success');
    } else {
      showNotification('Item not found', 'error');
    }
  };

  const handleManualSearch = () => {
    const query = searchQuery.trim().toLowerCase();
    const item = items.find(i => 
      i.item_id.toLowerCase() === query ||
      i.system_id.toLowerCase() === query ||
      i.name.toLowerCase().includes(query)
    );
    
    if (item) {
      setDispensingItem(item);
      setSearchQuery('');
      showNotification(`Found: ${item.name}`, 'success');
    } else {
      showNotification('Item not found', 'error');
    }
  };

  const dispenseItem = async (quantity) => {
    if (!dispensingItem) return;

    try {
      setLoading(true);

      const { data, error } = await supabase.rpc('dispense_item', {
        p_item_id: dispensingItem.item_id,
        p_quantity: quantity,
        p_location: selectedLocation,
        p_staff_email: 'staff@hhf.com',
        p_note: null
      });

      if (error) throw error;

      if (data.success) {
        showNotification(`Dispensed ${quantity} unit(s)`, 'success');
        setDispensingItem(null);
        await loadItems();
      } else {
        showNotification(data.error || 'Dispense failed', 'error');
      }
    } catch (error) {
      console.error('Error dispensing:', error);
      showNotification('Failed to dispense item', 'error');
    } finally {
      setLoading(false);
    }
  };

  const addStock = async (itemId, quantity) => {
    try {
      setLoading(true);

      const { data, error } = await supabase.rpc('add_stock', {
        p_item_id: itemId,
        p_quantity: quantity,
        p_location: selectedLocation
      });

      if (error) throw error;

      if (data.success) {
        showNotification(`Added ${quantity} unit(s)`, 'success');
        await loadItems();
      } else {
        showNotification(data.error || 'Add stock failed', 'error');
      }
    } catch (error) {
      console.error('Error adding stock:', error);
      showNotification('Failed to add stock', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.item_id.includes(searchQuery)
  );

  const lowStockItems = items.filter(item => item.quantity <= item.reorder_point);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-indigo-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Medical Inventory</h1>
                <p className="text-sm text-gray-600">Houston Hand & Foot</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-500" />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Broadway Office">Broadway</option>
                <option value="Pasadena Office">Pasadena</option>
                <option value="Friendswood Office">Friendswood</option>
              </select>
              
              <button onClick={loadItems} className="p-2 text-gray-600 hover:text-indigo-600">
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`fixed top-20 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {notification.message}
        </div>
      )}

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            {[
              { id: 'scan', label: 'Scan & Dispense', icon: Camera },
              { id: 'inventory', label: 'Inventory', icon: Package }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setView(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 font-medium ${
                  view === tab.id ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Dispensing Modal */}
        {dispensingItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">Dispense Item</h3>
                <button onClick={() => setDispensingItem(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Item</p>
                  <p className="text-lg font-semibold text-gray-900">{dispensingItem.name}</p>
                  <p className="text-sm text-gray-500 mt-1">{dispensingItem.category}</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Available Stock</p>
                  <p className="text-3xl font-bold text-blue-600">{dispensingItem.quantity}</p>
                  <p className="text-sm text-gray-500 mt-1">{selectedLocation}</p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 5].map(qty => (
                    <button
                      key={qty}
                      onClick={() => dispenseItem(qty)}
                      disabled={loading}
                      className="py-3 px-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50"
                    >
                      -{qty}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => {
                    const qty = prompt('Enter quantity:');
                    if (qty && !isNaN(qty) && parseInt(qty) > 0) {
                      dispenseItem(parseInt(qty));
                    }
                  }}
                  disabled={loading}
                  className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 disabled:opacity-50"
                >
                  Custom Amount
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SCAN VIEW */}
        {view === 'scan' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Scan Item</h2>
              
              {!scanning ? (
                <div className="space-y-4">
                  <button
                    onClick={startScanning}
                    className="w-full py-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 flex items-center justify-center gap-2"
                  >
                    <Camera className="w-5 h-5" />
                    Start Camera Scanner
                  </button>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">OR</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter barcode or item name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleManualSearch()}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      onClick={handleManualSearch}
                      className="px-6 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900 flex items-center gap-2"
                    >
                      <Search className="w-5 h-5" />
                      Search
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div id="qr-reader" className="rounded-lg overflow-hidden"></div>
                  <button
                    onClick={stopScanning}
                    className="w-full py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700"
                  >
                    Stop Scanner
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-sm text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-gray-900">{items.reduce((sum, i) => sum + i.quantity, 0)}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-sm text-gray-600">Low Stock Alerts</p>
                <p className="text-2xl font-bold text-orange-600">{lowStockItems.length}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-sm text-gray-600">Item Types</p>
                <p className="text-2xl font-bold text-gray-900">{items.length}</p>
              </div>
            </div>
          </div>
        )}

        {/* INVENTORY VIEW */}
        {view === 'inventory' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow p-4">
              <input
                type="text"
                placeholder="Search inventory..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {lowStockItems.length > 0 && (
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  <p className="font-semibold text-orange-900">
                    {lowStockItems.length} item(s) below reorder point
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {filteredItems.map(item => {
                const isLowStock = item.quantity <= item.reorder_point;
                
                return (
                  <div key={item.id} className={`bg-white rounded-lg shadow p-4 ${isLowStock ? 'border-l-4 border-orange-500' : ''}`}>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-600">{item.category}</p>
                        <p className="text-xs text-gray-500 mt-1">Barcode: {item.item_id}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-3xl font-bold ${isLowStock ? 'text-orange-600' : 'text-green-600'}`}>
                          {item.quantity}
                        </p>
                        <p className="text-xs text-gray-500">Reorder at {item.reorder_point}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => setDispensingItem(item)}
                        className="flex-1 py-2 bg-indigo-600 text-white rounded font-semibold hover:bg-indigo-700 flex items-center justify-center gap-1"
                      >
                        <Minus className="w-4 h-4" />
                        Dispense
                      </button>
                      <button
                        onClick={() => {
                          const qty = prompt('Enter quantity to add:');
                          if (qty && !isNaN(qty) && parseInt(qty) > 0) {
                            addStock(item.item_id, parseInt(qty));
                          }
                        }}
                        className="flex-1 py-2 bg-green-600 text-white rounded font-semibold hover:bg-green-700 flex items-center justify-center gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        Add Stock
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
