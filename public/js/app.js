import {OpenStreetMapProvider} from 'leaflet-geosearch';
import asistencia from './asistencia';
import comentarios from './comentarios';
//Se inicializa variables globales
var  map;
var markets;
var market;
var geocodeService;
var provider;
window.addEventListener('DOMContentLoaded', () => {
    const mapa = document.querySelector('.mapa');
    if (mapa) {
        //Se inicializa el mapa y los marcadores
        map = L.map('mapa');
        markets = new L.featureGroup().addTo(map);
        
        //Se inicializa provider y geocodeService
        geocodeService = L.esri.Geocoding.geocodeService();
        provider = new OpenStreetMapProvider();
        //Cargar el mapa
        //datos de la vista y markador automatico automarica
        const ll = [document.querySelector('#lat').value,document.querySelector('#lng').value];
        map.setView(ll, 13);
        market = new L.marker(ll, {
                draggable : true,
                autoPan : true
                
            }).addTo(map);
        actualizarMarket();
        markets.addLayer(market);
        market.on('moveend', actualizarMarket);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        //Buscar la Direccion 
        const busca = document.querySelector('#formbuscador');
        busca.addEventListener('input', buscarDireccion);


    }
    
    
    var input = document.querySelector('FORM');
    if (input) input.addEventListener("keydown", enter );
    
    const mapamitti = document.querySelector('#mapamitti');
    if (mapamitti) {
        
        const ll = [document.querySelector('#lat').value,document.querySelector('#lng').value];
        const direccion = document.querySelector('#direccion').value
        //Se inicializa el mapa y los marcadores
        
        map = L.map('mapamitti').setView(ll, 16);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        L.marker(ll).addTo(map)
            .bindPopup(direccion)
            .openPopup();
        
    }
    
    const mapamittis = document.querySelector('#mapamittis');
    
    if (mapamittis) {
        
        const ll = [document.querySelector('#lat').value,document.querySelector('#lng').value];
        //Se inicializa el mapa y los marcadores
        map = L.map('mapamittis').setView(ll, 13);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        const meetis = document.querySelectorAll('ul.listado-meeti li');
        meetis.forEach(meeti =>{ 
        L.marker([meeti.children[1].value,meeti.children[2].value]).addTo(map)
            .bindPopup(meeti.children[3].value)
        });
        
        
    }

    
});

 const buscarDireccion = async (e) => {
     if (e.target.value.length > 3) {
        const results = await provider.search({ query: e.target.value });
        //console.log(results);
        if (results.length) {
            markets.clearLayers();
            map.setView(results[0].bounds[0],16);
            market = new L.marker(results[0].bounds[0], {
                draggable : true,
                autoPan : true
            }).addTo(map);
            actualizarMarket();
            markets.addLayer(market);
            market.on('moveend',actualizarMarket);
        }
     }
};


const actualizarMarket = (ev) => {
    const ll=market.getLatLng();
    //geo coder 
    geocodeService.reverse().latlng(ll).run(function (error, result) {
        if (error) {
            console.log(error);
        }
        else  {
            market.bindPopup(result.address.Match_addr).openPopup();
            //console.log(result);
            //console.log(document.querySelector('#lat').value +'='+ result.latlng.lat +'\n'+ document.querySelector('#lng').value +'='+ result.latlng.lng);
            if (document.querySelector('#lat').value != result.latlng.lat || document.querySelector('#lng').value != result.latlng.lng) {
                document.querySelector('#direccion').value= result.address.Address || '';
                document.querySelector('#ciudad').value= result.address.City || '';
                document.querySelector('#estado').value= result.address.Region || '';
                document.querySelector('#pais').value= result.address.CountryCode || '';
                document.querySelector('#lat').value= result.latlng.lat || '';
                document.querySelector('#lng').value= result.latlng.lng || '';
            }
        }
    });
    
    map.panTo(ll);
};




const enter = (event) => {
    if ( event.target.getAttribute("type") !== 'submit' && event.keyCode === 13 ) {
        event.preventDefault();
        const inputs = Array.prototype.slice.call(document.querySelectorAll("input"));
        const index = (inputs.indexOf(document.activeElement) + 1) % inputs.length;
        const input = inputs[index];
        input.focus();
        input.select();
    }
};