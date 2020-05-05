package fr.district.codemax.service;

import java.util.List;

import javax.persistence.criteria.JoinType;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import io.github.jhipster.service.QueryService;

import fr.district.codemax.domain.Referent;
import fr.district.codemax.domain.*; // for static metamodels
import fr.district.codemax.repository.ReferentRepository;
import fr.district.codemax.repository.search.ReferentSearchRepository;
import fr.district.codemax.service.dto.ReferentCriteria;

/**
 * Service for executing complex queries for {@link Referent} entities in the database.
 * The main input is a {@link ReferentCriteria} which gets converted to {@link Specification},
 * in a way that all the filters must apply.
 * It returns a {@link List} of {@link Referent} or a {@link Page} of {@link Referent} which fulfills the criteria.
 */
@Service
@Transactional(readOnly = true)
public class ReferentQueryService extends QueryService<Referent> {

    private final Logger log = LoggerFactory.getLogger(ReferentQueryService.class);

    private final ReferentRepository referentRepository;

    private final ReferentSearchRepository referentSearchRepository;

    public ReferentQueryService(ReferentRepository referentRepository, ReferentSearchRepository referentSearchRepository) {
        this.referentRepository = referentRepository;
        this.referentSearchRepository = referentSearchRepository;
    }

    /**
     * Return a {@link List} of {@link Referent} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public List<Referent> findByCriteria(ReferentCriteria criteria) {
        log.debug("find by criteria : {}", criteria);
        final Specification<Referent> specification = createSpecification(criteria);
        return referentRepository.findAll(specification);
    }

    /**
     * Return a {@link Page} of {@link Referent} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<Referent> findByCriteria(ReferentCriteria criteria, Pageable page) {
        log.debug("find by criteria : {}, page: {}", criteria, page);
        final Specification<Referent> specification = createSpecification(criteria);
        return referentRepository.findAll(specification, page);
    }

    /**
     * Return the number of matching entities in the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the number of matching entities.
     */
    @Transactional(readOnly = true)
    public long countByCriteria(ReferentCriteria criteria) {
        log.debug("count by criteria : {}", criteria);
        final Specification<Referent> specification = createSpecification(criteria);
        return referentRepository.count(specification);
    }

    /**
     * Function to convert ConsumerCriteria to a {@link Specification}
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching {@link Specification} of the entity.
     */    
    private Specification<Referent> createSpecification(ReferentCriteria criteria) {
        Specification<Referent> specification = Specification.where(null);
        if (criteria != null) {
            if (criteria.getId() != null) {
                specification = specification.and(buildSpecification(criteria.getId(), Referent_.id));
            }
            if (criteria.getNom() != null) {
                specification = specification.and(buildStringSpecification(criteria.getNom(), Referent_.nom));
            }
            if (criteria.getPrenom() != null) {
                specification = specification.and(buildStringSpecification(criteria.getPrenom(), Referent_.prenom));
            }
            if (criteria.getLicence() != null) {
                specification = specification.and(buildStringSpecification(criteria.getLicence(), Referent_.licence));
            }
            if (criteria.getTelephone() != null) {
                specification = specification.and(buildStringSpecification(criteria.getTelephone(), Referent_.telephone));
            }
            if (criteria.getEmail() != null) {
                specification = specification.and(buildStringSpecification(criteria.getEmail(), Referent_.email));
            }
            if (criteria.getUserId() != null) {
                specification = specification.and(buildSpecification(criteria.getUserId(),
                    root -> root.join(Referent_.user, JoinType.LEFT).get(User_.id)));
            }
        }
        return specification;
    }
}
