package fr.district.codemax.service.impl;

import fr.district.codemax.service.ReferentService;
import fr.district.codemax.domain.Referent;
import fr.district.codemax.domain.Stade;
import fr.district.codemax.repository.ReferentRepository;
import fr.district.codemax.repository.search.ReferentSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing {@link Referent}.
 */
@Service
@Transactional
public class ReferentServiceImpl implements ReferentService {

    private final Logger log = LoggerFactory.getLogger(ReferentServiceImpl.class);

    private final ReferentRepository referentRepository;

    private final ReferentSearchRepository referentSearchRepository;

    public ReferentServiceImpl(ReferentRepository referentRepository, ReferentSearchRepository referentSearchRepository) {
        this.referentRepository = referentRepository;
        this.referentSearchRepository = referentSearchRepository;
    }

    /**
     * Save a referent.
     *
     * @param referent the entity to save.
     * @return the persisted entity.
     */
    @Override
    public Referent save(Referent referent) {
        log.debug("Request to save Referent : {}", referent);
        Referent result = referentRepository.save(referent);
        referentSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the referents.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Override
    @Transactional(readOnly = true)
    public Page<Referent> findAll(Pageable pageable) {
        log.debug("Request to get all Referents");
        return referentRepository.findAll(pageable);
    }
    
    /**
     * Get all the referents.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Override
    @Transactional(readOnly = true)
    public Page<Referent> findByUserIsCurrentUser(Pageable pageable) {
        log.debug("Request to get all Referents");
        return referentRepository.findByUserIsCurrentUser(pageable);
    }

    /**
     * Get one referent by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<Referent> findOne(Long id) {
        log.debug("Request to get Referent : {}", id);
        return referentRepository.findById(id);
    }

    /**
     * Delete the referent by id.
     *
     * @param id the id of the entity.
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Referent : {}", id);
        referentRepository.deleteById(id);
        referentSearchRepository.deleteById(id);
    }

    /**
     * Search for the referent corresponding to the query.
     *
     * @param query the query of the search.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Override
    @Transactional(readOnly = true)
    public Page<Referent> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Referents for query {}", query);
        return referentSearchRepository.search(queryStringQuery(query), pageable);    }
}
