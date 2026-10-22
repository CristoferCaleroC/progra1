package progra1.com.example.progra1.service;

public interface RickAndMortyService {
    Object obtenerPersonajes(int page);
    Object buscarPersonajesPorNombre(String name);
    Object obtenerPersonajePorId(Long id);

    Object obtenerLugares(int page);
    Object buscarLugaresPorNombre(String name);
    Object obtenerLugarPorId(Long id);

    Object obtenerEpisodios(int page);
    Object buscarEpisodiosPorNombre(String name);
    Object obtenerEpisodioPorId(Long id);
}