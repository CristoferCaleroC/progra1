package progra1.com.example.progra1;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "*") // Permite peticiones desde cualquier frontend web
public class ProductoController {

    @Autowired
    private ProductoRepository productoRepository;

    // 1. BUSCAR / OBTENER TODOS LOS PRODUCTOS
    @GetMapping
    public List<Producto> obtenerTodos() {
        return productoRepository.findAll();
    }

    // 2. BUSCAR UN PRODUCTO POR SU ID
    @GetMapping("/{id}")
    public Optional<Producto> obtenerPorId(@PathVariable Long id) {
        return productoRepository.findById(id);
    }

    // 3. INGRESAR / CREAR UN NUEVO PRODUCTO
    @PostMapping
    public Producto crearProducto(@RequestBody Producto producto) {
        return productoRepository.save(producto);
    }

    // 4. ELIMINAR UN PRODUCTO POR SU ID
    @DeleteMapping("/{id}")
    public String eliminarProducto(@PathVariable Long id) {
        if (productoRepository.existsById(id)) {
            productoRepository.deleteById(id);
            return "Producto con ID " + id + " eliminado con éxito.";
        } else {
            return "El producto con ID " + id + " no existe.";
        }
    }

    // 5. ACTUALIZAR UN PRODUCTO EXISTENTE (PUT)
    @PutMapping("/{id}")
    public Producto actualizarProducto(@PathVariable Long id, @RequestBody Producto productoDetalles) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));
        
        producto.setNombre(productoDetalles.getNombre());
        producto.setPrecio(productoDetalles.getPrecio());
        producto.setDescripcion(productoDetalles.getDescripcion());
        producto.setImagen(productoDetalles.getImagen());
        
        return productoRepository.save(producto);
    }
}