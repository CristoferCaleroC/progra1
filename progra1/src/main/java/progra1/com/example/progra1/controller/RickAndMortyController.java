package progra1.com.example.progra1.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import progra1.com.example.progra1.service.RickAndMortyService;

@RestController
@RequestMapping("/api/rickandmorty")
public class RickAndMortyController {

    @Autowired
    private RickAndMortyService rickAndMortyService;

    // --- PERSONAJES ---
    @GetMapping("/personajes")
    public Object obtenerPersonajes(
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false) String name) {
        if (name != null && !name.isEmpty()) {
            return rickAndMortyService.buscarPersonajesPorNombre(name);
        }
        return rickAndMortyService.obtenerPersonajes(page);
    }

    @GetMapping("/personajes/{id}")
    public Object obtenerPersonajePorId(@PathVariable Long id) {
        return rickAndMortyService.obtenerPersonajePorId(id);
    }

    // --- LUGARES ---
    @GetMapping("/lugares")
    public Object obtenerLugares(
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false) String name) {
        if (name != null && !name.isEmpty()) {
            return rickAndMortyService.buscarLugaresPorNombre(name);
        }
        return rickAndMortyService.obtenerLugares(page);
    }

    @GetMapping("/lugares/{id}")
    public Object obtenerLugarPorId(@PathVariable Long id) {
        return rickAndMortyService.obtenerLugarPorId(id);
    }

    // --- EPISODIOS ---
    @GetMapping("/episodios")
    public Object obtenerEpisodios(
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false) String name) {
        if (name != null && !name.isEmpty()) {
            return rickAndMortyService.buscarEpisodiosPorNombre(name);
        }
        return rickAndMortyService.obtenerEpisodios(page);
    }

    @GetMapping("/episodios/{id}")
    public Object obtenerEpisodioPorId(@PathVariable Long id) {
        return rickAndMortyService.obtenerEpisodioPorId(id);
    }
}