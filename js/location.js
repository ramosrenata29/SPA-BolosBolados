/**
 * location.js - Serviço de Captura Obrigatória de Geolocalização
 */

class LocationService {
  /**
   * Tenta capturar a geolocalização do usuário
   * @returns {Promise<{latitude: number, longitude: number, accuracy: number}>}
   */
  async requestLocation() {
    return new Promise((resolve, reject) => {
      if (!('geolocation' in navigator)) {
        reject(new Error('Navegador não possui suporte para Geolocalização.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          let errorMessage = 'Não foi possível capturar sua localização.';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Permissão de localização negada pelo usuário. O cadastro não pode ser concluído sem a localização.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Informação de localização indisponível no dispositivo.';
              break;
            case error.TIMEOUT:
              errorMessage = 'A requisição para capturar a localização expirou.';
              break;
          }
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  }
}

window.locationService = new LocationService();
