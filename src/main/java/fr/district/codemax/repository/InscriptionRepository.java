package fr.district.codemax.repository;

import fr.district.codemax.domain.Inscription;

import java.util.List;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Inscription entity.
 */
@SuppressWarnings("unused")
@Repository
public interface InscriptionRepository extends JpaRepository<Inscription, Long> {

	@Query("select inscription from Inscription inscription where inscription.plateau.id =:id")
	List<Inscription> findAllByPlateau(@Param("id") Long id);
}
