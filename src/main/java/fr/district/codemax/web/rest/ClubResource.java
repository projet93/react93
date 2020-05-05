package fr.district.codemax.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import fr.district.codemax.domain.Club;
import fr.district.codemax.domain.Stade;
import fr.district.codemax.domain.User;
import fr.district.codemax.security.AuthoritiesConstants;
import fr.district.codemax.service.ClubService;
import fr.district.codemax.service.MailService;
import fr.district.codemax.service.UserService;
import fr.district.codemax.service.dto.UserDTO;
import fr.district.codemax.web.rest.errors.BadRequestAlertException;
import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link fr.district.codemax.domain.Club}.
 */
@RestController
@RequestMapping("/api")
public class ClubResource {

    private final Logger log = LoggerFactory.getLogger(ClubResource.class);

    private static final String ENTITY_NAME = "club";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ClubService clubService;

    @Autowired
    private UserService userService;
    @Autowired
    private MailService mailService;
    
    public ClubResource(ClubService clubService) {
        this.clubService = clubService;
    }

    /**
     * {@code POST  /clubs} : Create a new club.
     *
     * @param club the club to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new club, or with status {@code 400 (Bad Request)} if the club has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/clubs")
    public ResponseEntity<Club> createClub(@Valid @RequestBody Club club) throws URISyntaxException {
        log.debug("REST request to save Club : {}", club);
        if (club.getId() != null) {
            throw new BadRequestAlertException("A new club cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Club result = clubService.save(club);
        
        UserDTO userDto = new UserDTO();
        userDto.setEmail(result.getEmail());
        userDto.setLogin("club"+result.getId());
        Set<String> authorities = new HashSet<>();
        authorities.add(AuthoritiesConstants.USER);
        userDto.setAuthorities(authorities);
        userDto.setFirstName(result.getNom());
        userDto.setLastName("CLUB");
        userDto.setActivated(true);
        userDto.setLangKey("fr");
        User user = new User();
        user.setEmail(result.getEmail());
        user.setLangKey("fr");
        mailService.sendActivationEmail(user);
        user = userService.registerUser(userDto, "123456");
        
        
        result.setUser(user);
        updateClub(result);
        return ResponseEntity.created(new URI("/api/clubs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /clubs} : Updates an existing club.
     *
     * @param club the club to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated club,
     * or with status {@code 400 (Bad Request)} if the club is not valid,
     * or with status {@code 500 (Internal Server Error)} if the club couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/clubs")
    public ResponseEntity<Club> updateClub(@Valid @RequestBody Club club) throws URISyntaxException {
        log.debug("REST request to update Club : {}", club);
        if (club.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Club result = clubService.save(club);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, club.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /clubs} : get all the clubs.
     *
     * @param pageable the pagination information.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of clubs in body.
     */
    @GetMapping("/clubs")
    public ResponseEntity<List<Club>> getAllClubs(Pageable pageable, @RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get a page of Clubs");
        Page<Club> page;
        if (eagerload) {
            page = clubService.findAllWithEagerRelationships(pageable);
        } else {
            page = clubService.findAll(pageable);
        }
        
//        Page<Club> page = clubService.findByUserIsCurrentUser(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /clubs/:id} : get the "id" club.
     *
     * @param id the id of the club to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the club, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/clubs/{id}")
    public ResponseEntity<Club> getClub(@PathVariable Long id) {
        log.debug("REST request to get Club : {}", id);
        Optional<Club> club = clubService.findOne(id);
        return ResponseUtil.wrapOrNotFound(club);
    }
    
    
    @GetMapping("/clubs/user")
    public ResponseEntity<Club> getClubByUser() {
        log.debug("REST request to get Club : {}");
        Optional<Club> club = clubService.findByUser();
        return ResponseUtil.wrapOrNotFound(club);
    }
    /**
     * {@code DELETE  /clubs/:id} : delete the "id" club.
     *
     * @param id the id of the club to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/clubs/{id}")
    public ResponseEntity<Void> deleteClub(@PathVariable Long id) {
        log.debug("REST request to delete Club : {}", id);
        clubService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/clubs?query=:query} : search for the club corresponding
     * to the query.
     *
     * @param query the query of the club search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/clubs")
    public ResponseEntity<List<Club>> searchClubs(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Clubs for query {}", query);
        Page<Club> page = clubService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }
}
