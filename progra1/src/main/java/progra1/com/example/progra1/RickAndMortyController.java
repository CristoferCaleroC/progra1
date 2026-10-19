package progra1.com.example.progra1;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;


@RestController
@RequestMapping("/api/rickandmorty")
public class RickAndMortyController {

    private final RestTemplate restTemplate = new RestTemplate();

    // Endpoint 1: Personajes
    @GetMapping("/personajes")
    public Object obtenerPersonajes(@RequestParam(required = false, defaultValue = "1") int page) {
        String url = "https://rickandmortyapi.com/api/character?page=" + page;
        return restTemplate.getForObject(url, Object.class);
    }

    // Endpoint 2: Lugares
    @GetMapping("/lugares")
    public Object obtenerLugares(@RequestParam(required = false, defaultValue = "1") int page) {
        String url = "https://rickandmortyapi.com/api/location?page=" + page;
        return restTemplate.getForObject(url, Object.class);
    }

    // Endpoint 3: Episodios
    @GetMapping("/episodios")
    public Object obtenerEpisodios(@RequestParam(required = false, defaultValue = "1") int page) {
        String url = "https://rickandmortyapi.com/api/episode?page=" + page;
        return restTemplate.getForObject(url, Object.class);
    }
}