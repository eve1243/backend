'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Endpoint {
  method: string;
  path: string;
  description: string;
  auth: boolean;
  requestBody?: any;
  responseExample?: any;
}

export default function ApiDocumentation() {
  const [activeTab, setActiveTab] = useState('products');

  const endpoints: Record<string, Endpoint[]> = {
    products: [
      {
        method: 'GET',
        path: '/api/products',
        description: 'Liste alle Produkte auf',
        auth: false,
        responseExample: {
          success: true,
          data: [
            {
              _id: "60d21b4667d0d8992e610c85",
              name: "Produkt Name",
              price: 19.99,
              description: "Produktbeschreibung...",
              cloudinaryUrl: "https://res.cloudinary.com/...",
              cloudinaryId: "sport-liesbauer-products/abc123",
              createdAt: "2023-07-01T10:30:00.000Z",
              updatedAt: "2023-07-02T14:20:00.000Z"
            }
          ]
        }
      },
      {
        method: 'GET',
        path: '/api/products/:id',
        description: 'Rufe ein Produkt anhand seiner ID ab',
        auth: false,
        responseExample: {
          success: true,
          data: {
            _id: "60d21b4667d0d8992e610c85",
            name: "Produkt Name",
            price: 19.99,
            description: "Produktbeschreibung...",
            cloudinaryUrl: "https://res.cloudinary.com/...",
            cloudinaryId: "sport-liesbauer-products/abc123",
            createdAt: "2023-07-01T10:30:00.000Z",
            updatedAt: "2023-07-02T14:20:00.000Z"
          }
        }
      },
      {
        method: 'POST',
        path: '/api/products',
        description: 'Erstelle ein neues Produkt',
        auth: true,
        requestBody: {
          name: "Produkt Name",
          price: 19.99,
          description: "Produktbeschreibung...",
          cloudinaryUrl: "https://res.cloudinary.com/...",
          cloudinaryId: "sport-liesbauer-products/abc123"
        },
        responseExample: {
          success: true,
          data: {
            _id: "60d21b4667d0d8992e610c85",
            name: "Produkt Name",
            price: 19.99,
            description: "Produktbeschreibung...",
            cloudinaryUrl: "https://res.cloudinary.com/...",
            cloudinaryId: "sport-liesbauer-products/abc123",
            createdAt: "2023-07-01T10:30:00.000Z",
            updatedAt: "2023-07-01T10:30:00.000Z"
          }
        }
      },
      {
        method: 'PUT',
        path: '/api/products/:id',
        description: 'Aktualisiere ein Produkt anhand seiner ID',
        auth: true,
        requestBody: {
          name: "Aktualisierter Produktname",
          price: 24.99,
          description: "Aktualisierte Beschreibung...",
          cloudinaryUrl: "https://res.cloudinary.com/...",
          cloudinaryId: "sport-liesbauer-products/abc123"
        },
        responseExample: {
          success: true,
          data: {
            _id: "60d21b4667d0d8992e610c85",
            name: "Aktualisierter Produktname",
            price: 24.99,
            description: "Aktualisierte Beschreibung...",
            cloudinaryUrl: "https://res.cloudinary.com/...",
            cloudinaryId: "sport-liesbauer-products/abc123",
            createdAt: "2023-07-01T10:30:00.000Z",
            updatedAt: "2023-07-02T14:20:00.000Z"
          }
        }
      },
      {
        method: 'DELETE',
        path: '/api/products/:id',
        description: 'Lösche ein Produkt anhand seiner ID',
        auth: true,
        responseExample: {
          success: true,
          data: {}
        }
      }
    ],
    upload: [
      {
        method: 'POST',
        path: '/api/upload',
        description: 'Lade ein Bild auf Cloudinary hoch',
        auth: true,
        requestBody: "FormData mit file-Feld (Datei muss JPEG, PNG, GIF oder WebP sein, max. 5MB)",
        responseExample: {
          success: true,
          data: {
            url: "https://res.cloudinary.com/...",
            publicId: "sport-liesbauer-products/abc123",
            format: "jpg",
            width: 800,
            height: 600,
            size: 123456
          }
        }
      }
    ],
    auth: [
      {
        method: 'POST',
        path: '/api/auth/[...nextauth]',
        description: 'Next-Auth-Endpunkte für Authentifizierung',
        auth: false,
        responseExample: "Variiert je nach Next-Auth-Aktion"
      }
    ]
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">API-Dokumentation</h1>
      
      <div className="mb-8">
        <p className="text-gray-600 mb-4">
          Diese Dokumentation beschreibt die verfügbaren API-Endpunkte für das Sport-Liesbauer-Backend.
          Alle Antworten werden im JSON-Format zurückgegeben und enthalten ein <code>success</code>-Feld,
          das angibt, ob die Anfrage erfolgreich war, sowie ein <code>data</code>- oder <code>error</code>-Feld.
        </p>
        
        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Authentifizierung</h2>
        <p className="text-gray-600 mb-4">
          Geschützte Endpunkte (mit <span className="text-red-500 font-medium">Auth: Ja</span> gekennzeichnet) erfordern eine Authentifizierung.
          Die Authentifizierung erfolgt über NextAuth.js Sessions. Frontend-Clients sollten die entsprechenden NextAuth.js Funktionen verwenden.
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('products')}
              className={`py-4 px-6 font-medium text-sm border-b-2 ${
                activeTab === 'products'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Produkte
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`py-4 px-6 font-medium text-sm border-b-2 ${
                activeTab === 'upload'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Datei-Upload
            </button>
            <button
              onClick={() => setActiveTab('auth')}
              className={`py-4 px-6 font-medium text-sm border-b-2 ${
                activeTab === 'auth'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Authentifizierung
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {endpoints[activeTab].map((endpoint, index) => (
            <div 
              key={`${endpoint.method}-${endpoint.path}`}
              className={`${index > 0 ? 'mt-10 pt-10 border-t border-gray-200' : ''}`}
            >
              <div className="flex items-center mb-4">
                <span className={`inline-block px-2 py-1 text-xs font-bold rounded mr-3 ${
                  endpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
                  endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                  endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {endpoint.method}
                </span>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">{endpoint.path}</code>
              </div>
              
              <p className="text-gray-700 mb-2">{endpoint.description}</p>
              <p className="text-sm mb-4">
                <span className="font-medium">Auth:</span> 
                <span className={endpoint.auth ? 'text-red-500 ml-1' : 'text-green-500 ml-1'}>
                  {endpoint.auth ? 'Ja' : 'Nein'}
                </span>
              </p>
              
              {endpoint.requestBody && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Request Body:</h4>
                  <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto">
                    {typeof endpoint.requestBody === 'string' 
                      ? endpoint.requestBody 
                      : JSON.stringify(endpoint.requestBody, null, 2)}
                  </pre>
                </div>
              )}
              
              {endpoint.responseExample && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Response Example:</h4>
                  <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto">
                    {typeof endpoint.responseExample === 'string' 
                      ? endpoint.responseExample 
                      : JSON.stringify(endpoint.responseExample, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-8">
        <Link href="/admin" className="text-blue-500 hover:underline">
          Zurück zum Admin-Bereich
        </Link>
      </div>
    </div>
  );
}
