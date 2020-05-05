package fr.district.codemax.repository;

import fr.district.codemax.domain.Referent;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the Referent entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ReferentRepository extends JpaRepository<Referent, Long>, JpaSpecificationExecutor<Referent> {

    @Query("select referent from Referent referent where referent.user.login = ?#{principal.username}")
    List<Referent> findByUserIsCurrentUser();

    @Query("select referent from Referent referent where referent.user.login = ?#{principal.username}")
	Page<Referent> findByUserIsCurrentUser(Pageable pageable);
}
