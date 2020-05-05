package fr.district.codemax.repository;

import fr.district.codemax.domain.Stade;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the Stade entity.
 */
@SuppressWarnings("unused")
@Repository
public interface StadeRepository extends JpaRepository<Stade, Long> {

    @Query("select stade from Stade stade where stade.user.login = ?#{principal.username}")
    Page<Stade> findByUserIsCurrentUser(Pageable pageable);
}
