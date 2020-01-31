import {OpenStreetMapProvider} from 'leaflet-geosearch';
//Se inicializa el mapa y los marcadores
var  map = L.map('mapa');
var markets = new L.featureGroup().addTo(map);
var market;
var geocodeService;
var provider;
document.addEventListener('DOMContentLoaded', () => {
    const mapa = document.querySelector('.mapa');
    if (mapa) {
        //Se inicializa provider y geocodeService
        geocodeService = L.esri.Geocoding.geocodeService();
        provider = new OpenStreetMapProvider();
        //Cargar el mapa
        //datos de la vista y markador automatico automarica
        const ll = [mapa.dataset.la,mapa.dataset.lo];
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
            console.log(result);
            document.querySelector('#direccion').value= result.address.Address || '';
            document.querySelector('#ciudad').value= result.address.City || '';
            document.querySelector('#estado').value= result.address.Region || '';
            document.querySelector('#pais').value= result.address.CountryCode || '';
            document.querySelector('#lat').value= result.latlng.lat || '';
            document.querySelector('#lng').value= result.latlng.lng || '';
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
}