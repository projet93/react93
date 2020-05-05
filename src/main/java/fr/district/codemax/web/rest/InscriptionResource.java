package fr.district.codemax.web.rest;

import fr.district.codemax.domain.Inscription;
import fr.district.codemax.service.InscriptionService;
import fr.district.codemax.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing {@link fr.district.codemax.domain.Inscription}.
 */
@RestController
@RequestMapping("/api")
public class InscriptionResource {

    private final Logger log = LoggerFactory.getLogger(InscriptionResource.class);

    private static final String ENTITY_NAME = "inscription";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final InscriptionService inscriptionService;

    public InscriptionResource(InscriptionService inscriptionService) {
        this.inscriptionService = inscriptionService;
    }

    /**
     * {@code POST  /inscriptions} : Create a new inscription.
     *
     * @param inscription the inscription to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new inscription, or with status {@code 400 (Bad Request)} if the inscription has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/inscriptions")
    public ResponseEntity<Inscription> createInscription(@Valid @RequestBody Inscription inscription) throws URISyntaxException {
        log.debug("REST request to save Inscription : {}", inscription);
        if (inscription.getId() != null) {
            throw new BadRequestAlertException("A new inscription cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Inscription result = inscriptionService.save(inscription);
        return ResponseEntity.created(new URI("/api/inscriptions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /inscriptions} : Updates an existing inscription.
     *
     * @param inscription the inscription to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated inscription,
     * or with status {@code 400 (Bad Request)} if the inscription is not valid,
     * or with status {@code 500 (Internal Server Error)} if the inscription couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/inscriptions")
    public ResponseEntity<Inscription> updateInscription(@Valid @RequestBody Inscription inscription) throws URISyntaxException {
        log.debug("REST request to update Inscription : {}", inscription);
        if (inscription.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Inscription result = inscriptionService.update(inscription);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, inscription.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /inscriptions} : get all the inscriptions.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of inscriptions in body.
     */
    @GetMapping("/inscriptions")
    public List<Inscription> getAllInscriptions() {
        log.debug("REST request to get all Inscriptions");
        return inscriptionService.findAll();
    }


	@GetMapping("/inscriptions/plateau/{id}")
    public List<Inscription> getAllInscriptionsByPlateau(@PathVariable Long id) {
        log.debug("REST request to get all Inscriptions");
        return inscriptionService.findAllByPlateau(id);
    }
    
    
    /**
     * {@code GET  /inscriptions/:id} : get the "id" inscription.
     *
     * @param id the id of the inscription to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the inscription, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/inscriptions/{id}")
    public ResponseEntity<Inscription> getInscription(@PathVariable Long id) {
        log.debug("REST request to get Inscription : {}", id);
        Optional<Inscription> inscription = inscriptionService.findOne(id);
        return ResponseUtil.wrapOrNotFound(inscription);
    }

    /**
     * {@code DELETE  /inscriptions/:id} : delete the "id" inscription.
     *
     * @param id the id of the inscription to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/inscriptions/{id}")
    public ResponseEntity<Void> deleteInscription(@PathVariable Long id) {
        log.debug("REST request to delete Inscription : {}", id);
        inscriptionService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/inscriptions?query=:query} : search for the inscription corresponding
     * to the query.
     *
     * @param query the query of the inscription search.
     * @return the result of the search.
     */
    @GetMapping("/_search/inscriptions")
    public List<Inscription> searchInscriptions(@RequestParam String query) {
        log.debug("REST request to search Inscriptions for query {}", query);
        return inscriptionService.search(query);
    }

}
