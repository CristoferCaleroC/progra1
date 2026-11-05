package progra1.com.example.progra1.service;

import progra1.com.example.progra1.model.Producto;
import java.util.List;
import java.util.Optional;

public interface ProductoService {
    List<Producto> obtenerTodos();
    Optional<Producto> obtenerPorId(Long id);
    Producto guardarProducto(Producto producto);
    boolean eliminarProducto(Long id);
    Producto actualizarProducto(Long id, Producto productoDetalles);
}