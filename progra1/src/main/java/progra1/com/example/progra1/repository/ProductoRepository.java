package progra1.com.example.progra1.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import progra1.com.example.progra1.model.Producto;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
}