package progra1.com.example.progra1.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import progra1.com.example.progra1.service.RickAndMortyService;

@Service
public class RickAndMortyServiceImpl implements RickAndMortyService {

    private final RestTemplate restTemplate = new RestTemplate();

    // --- PERSONAJES ---
    @Override
    public Object obtenerPersonajes(int page) {
        String url = "https://rickandmortyapi.com/api/character?page=" + page;
        return restTemplate.getForObject(url, Object.class);
    }

    @Override
    public Object buscarPersonajesPorNombre(String name) {
        String url = "https://rickandmortyapi.com/api/character/?name=" + name;
        return restTemplate.getForObject(url, Object.class);
    }

    @Override
    public Object obtenerPersonajePorId(Long id) {
        String url = "https://rickandmortyapi.com/api/character/" + id;
        return restTemplate.getForObject(url, Object.class);
    }

    // --- LUGARES ---
    @Override
    public Object obtenerLugares(int page) {
        String url = "https://rickandmortyapi.com/api/location?page=" + page;
        return restTemplate.getForObject(url, Object.class);
    }

    @Override
    public Object buscarLugaresPorNombre(String name) {
        String url = "https://rickandmortyapi.com/api/location/?name=" + name;
        return restTemplate.getForObject(url, Object.class);
    }

    @Override
    public Object obtenerLugarPorId(Long id) {
        String url = "https://rickandmortyapi.com/api/location/" + id;
        return restTemplate.getForObject(url, Object.class);
    }

    // --- EPISODIOS ---
    @Override
    public Object obtenerEpisodios(int page) {
        String url = "https://rickandmortyapi.com/api/episode?page=" + page;
        return restTemplate.getForObject(url, Object.class);
    }

    @Override
    public Object buscarEpisodiosPorNombre(String name) {
        String url = "https://rickandmortyapi.com/api/episode/?name=" + name;
        return restTemplate.getForObject(url, Object.class);
    }

    @Override
    public Object obtenerEpisodioPorId(Long id) {
        String url = "https://rickandmortyapi.com/api/episode/" + id;
        return restTemplate.getForObject(url, Object.class);
    }
}