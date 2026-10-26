package progra1.com.example.progra1.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import progra1.com.example.progra1.service.RickAndMortyService;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class RickAndMortyServiceImpl implements RickAndMortyService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final String BASE_URL = "https://rickandmortyapi.com/api";

    // --- PERSONAJES ---
    @Override
    public Object obtenerPersonajes(int page) {
        String url = BASE_URL + "/character?page=" + page;
        return restTemplate.getForObject(url, Object.class);
    }

    @Override
    public Object buscarPersonajesPorNombre(String name) {
        String url = BASE_URL + "/character/?name=" + name;
        return restTemplate.getForObject(url, Object.class);
    }

    @Override
    public Object obtenerPersonajePorId(Long id) {
        String url = BASE_URL + "/character/" + id;
        return restTemplate.getForObject(url, Object.class);
    }

    // --- LUGARES ---
    @Override
    public Object obtenerLugares(int page) {
        String url = BASE_URL + "/location?page=" + page;
        return restTemplate.getForObject(url, Object.class);
    }

    @Override
    public Object buscarLugaresPorNombre(String name) {
        String url = BASE_URL + "/location/?name=" + name;
        return restTemplate.getForObject(url, Object.class);
    }

    @Override
    public Object obtenerLugarPorId(Long id) {
        String url = BASE_URL + "/location/" + id;
        return restTemplate.getForObject(url, Object.class);
    }

    // --- EPISODIOS ---
    @Override
    public Object obtenerEpisodios(int page) {
        String url = BASE_URL + "/episode?page=" + page;
        return restTemplate.getForObject(url, Object.class);
    }

    @Override
    public Object buscarEpisodiosPorNombre(String name) {
        String url = BASE_URL + "/episode/?name=" + name;
        return restTemplate.getForObject(url, Object.class);
    }

    @Override
    public Object obtenerEpisodioPorId(Long id) {
        String url = BASE_URL + "/episode/" + id;
        return restTemplate.getForObject(url, Object.class);
    }

    // --- ENDPOINTS ANINADOS (Consumiendo las URLs que provee la API) ---
    @Override
    @SuppressWarnings("unchecked")
    public Object obtenerPersonajesDeEpisodio(Long id) {
        try {
            String episodioUrl = BASE_URL + "/episode/" + id;
            Map<String, Object> episodio = restTemplate.getForObject(episodioUrl, Map.class);
            
            if (episodio == null || !episodio.containsKey("characters")) {
                return new ArrayList<>();
            }

            List<String> characterUrls = (List<String>) episodio.get("characters");
            List<Object> personajes = new ArrayList<>();

            for (String url : characterUrls) {
                Object personaje = restTemplate.getForObject(url, Object.class);
                personajes.add(personaje);
            }
            
            return personajes;
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    @Override
    @SuppressWarnings("unchecked")
    public Object obtenerResidentesDeLugar(Long id) {
        try {
            String lugarUrl = BASE_URL + "/location/" + id;
            Map<String, Object> lugar = restTemplate.getForObject(lugarUrl, Map.class);
            
            if (lugar == null || !lugar.containsKey("residents")) {
                return new ArrayList<>();
            }

            List<String> residentUrls = (List<String>) lugar.get("residents");
            List<Object> residentes = new ArrayList<>();

            for (String url : residentUrls) {
                Object residente = restTemplate.getForObject(url, Object.class);
                residentes.add(residente);
            }
            
            return residentes;
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

@Override
    @SuppressWarnings("unchecked")
    public Object obtenerUbicacionYEpisodiosDePersonaje(Long id) {
        try {
            String characterUrl = BASE_URL + "/character/" + id;
            Map<String, Object> character = restTemplate.getForObject(characterUrl, Map.class);
            if (character == null) return new java.util.HashMap<>();

            java.util.Map<String, Object> resultado = new java.util.HashMap<>();
            resultado.put("characterName", character.get("name"));
            resultado.put("characterImage", character.get("image"));

            // 1. Manejo seguro del lugar
            Object locationInfo = character.get("location");
            if (locationInfo instanceof Map) {
                Map<String, Object> locMap = (Map<String, Object>) locationInfo;
                String locUrl = (String) locMap.get("url");
                if (locUrl != null && !locUrl.isEmpty()) {
                    try {
                        Object locationDetails = restTemplate.getForObject(locUrl, Object.class);
                        resultado.put("lugar", locationDetails);
                    } catch (Exception e) {
                        resultado.put("lugar", locMap);
                    }
                } else {
                    resultado.put("lugar", locMap);
                }
            } else {
                resultado.put("lugar", locationInfo);
            }

            // 2. Optimización por Lotes (Batch): ¡Una sola petición para todos los episodios!
            Object episodesObj = character.get("episode");
            List<Object> episodios = new ArrayList<>();
            
            if (episodesObj instanceof List) {
                List<?> episodeUrls = (List<?>) episodesObj;
                List<String> idsList = new ArrayList<>();
                
                // Extraemos únicamente el ID numérico de cada URL de episodio
                for (Object epUrlObj : episodeUrls) {
                    if (epUrlObj instanceof String) {
                        String urlStr = (String) epUrlObj;
                        String episodeId = urlStr.substring(urlStr.lastIndexOf("/") + 1);
                        idsList.add(episodeId);
                    }
                }
                
                if (!idsList.isEmpty()) {
                    // Unimos todos los IDs con comas (Ej: "1,2,3,10,25")
                    String idsString = String.join(",", idsList);
                    String batchUrl = BASE_URL + "/episode/" + idsString;
                    
                    try {
                        Object response = restTemplate.getForObject(batchUrl, Object.class);
                        // Si son varios episodios, la API devuelve una lista. Si fuera solo 1, devuelve un mapa.
                        if (response instanceof List) {
                            episodios = (List<Object>) response;
                        } else if (response instanceof Map) {
                            episodios.add(response);
                        }
                    } catch (Exception e) {
                        System.err.println("Error al cargar episodios por lote: " + e.getMessage());
                    }
                }
            }
            resultado.put("episodios", episodios);

            return resultado;
        } catch (Exception e) {
            System.err.println("Error en endpoint anidado de personaje: " + e.getMessage());
            return new java.util.HashMap<>();
        }
    }
}