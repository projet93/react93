package fr.district.codemax.web.rest;

import fr.district.codemax.React93App;
import fr.district.codemax.domain.Club;
import fr.district.codemax.repository.ClubRepository;
import fr.district.codemax.repository.search.ClubSearchRepository;
import fr.district.codemax.service.ClubService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;
import javax.persistence.EntityManager;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link ClubResource} REST controller.
 */
@SpringBootTest(classes = React93App.class)
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
public class ClubResourceIT {

    private static final byte[] DEFAULT_LOGO = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_LOGO = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_LOGO_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_LOGO_CONTENT_TYPE = "image/png";

    private static final String DEFAULT_NOM = "AAAAAAAAAA";
    private static final String UPDATED_NOM = "BBBBBBBBBB";

    private static final String DEFAULT_ADRESSE = "AAAAAAAAAA";
    private static final String UPDATED_ADRESSE = "BBBBBBBBBB";

    private static final String DEFAULT_TELEPHONE = "AAAAAAAAAA";
    private static final String UPDATED_TELEPHONE = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    @Autowired
    private ClubRepository clubRepository;

    @Mock
    private ClubRepository clubRepositoryMock;

    @Mock
    private ClubService clubServiceMock;

    @Autowired
    private ClubService clubService;

    /**
     * This repository is mocked in the fr.district.codemax.repository.search test package.
     *
     * @see fr.district.codemax.repository.search.ClubSearchRepositoryMockConfiguration
     */
    @Autowired
    private ClubSearchRepository mockClubSearchRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restClubMockMvc;

    private Club club;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Club createEntity(EntityManager em) {
        Club club = new Club()
            .logo(DEFAULT_LOGO)
            .logoContentType(DEFAULT_LOGO_CONTENT_TYPE)
            .nom(DEFAULT_NOM)
            .adresse(DEFAULT_ADRESSE)
            .telephone(DEFAULT_TELEPHONE)
            .email(DEFAULT_EMAIL);
        return club;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Club createUpdatedEntity(EntityManager em) {
        Club club = new Club()
            .logo(UPDATED_LOGO)
            .logoContentType(UPDATED_LOGO_CONTENT_TYPE)
            .nom(UPDATED_NOM)
            .adresse(UPDATED_ADRESSE)
            .telephone(UPDATED_TELEPHONE)
            .email(UPDATED_EMAIL);
        return club;
    }

    @BeforeEach
    public void initTest() {
        club = createEntity(em);
    }

    @Test
    @Transactional
    public void createClub() throws Exception {
        int databaseSizeBeforeCreate = clubRepository.findAll().size();

        // Create the Club
        restClubMockMvc.perform(post("/api/clubs")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(club)))
            .andExpect(status().isCreated());

        // Validate the Club in the database
        List<Club> clubList = clubRepository.findAll();
        assertThat(clubList).hasSize(databaseSizeBeforeCreate + 1);
        Club testClub = clubList.get(clubList.size() - 1);
        assertThat(testClub.getLogo()).isEqualTo(DEFAULT_LOGO);
        assertThat(testClub.getLogoContentType()).isEqualTo(DEFAULT_LOGO_CONTENT_TYPE);
        assertThat(testClub.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testClub.getAdresse()).isEqualTo(DEFAULT_ADRESSE);
        assertThat(testClub.getTelephone()).isEqualTo(DEFAULT_TELEPHONE);
        assertThat(testClub.getEmail()).isEqualTo(DEFAULT_EMAIL);

        // Validate the Club in Elasticsearch
        verify(mockClubSearchRepository, times(1)).save(testClub);
    }

    @Test
    @Transactional
    public void createClubWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = clubRepository.findAll().size();

        // Create the Club with an existing ID
        club.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restClubMockMvc.perform(post("/api/clubs")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(club)))
            .andExpect(status().isBadRequest());

        // Validate the Club in the database
        List<Club> clubList = clubRepository.findAll();
        assertThat(clubList).hasSize(databaseSizeBeforeCreate);

        // Validate the Club in Elasticsearch
        verify(mockClubSearchRepository, times(0)).save(club);
    }


    @Test
    @Transactional
    public void checkNomIsRequired() throws Exception {
        int databaseSizeBeforeTest = clubRepository.findAll().size();
        // set the field null
        club.setNom(null);

        // Create the Club, which fails.

        restClubMockMvc.perform(post("/api/clubs")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(club)))
            .andExpect(status().isBadRequest());

        List<Club> clubList = clubRepository.findAll();
        assertThat(clubList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkEmailIsRequired() throws Exception {
        int databaseSizeBeforeTest = clubRepository.findAll().size();
        // set the field null
        club.setEmail(null);

        // Create the Club, which fails.

        restClubMockMvc.perform(post("/api/clubs")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(club)))
            .andExpect(status().isBadRequest());

        List<Club> clubList = clubRepository.findAll();
        assertThat(clubList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllClubs() throws Exception {
        // Initialize the database
        clubRepository.saveAndFlush(club);

        // Get all the clubList
        restClubMockMvc.perform(get("/api/clubs?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(club.getId().intValue())))
            .andExpect(jsonPath("$.[*].logoContentType").value(hasItem(DEFAULT_LOGO_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].logo").value(hasItem(Base64Utils.encodeToString(DEFAULT_LOGO))))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM)))
            .andExpect(jsonPath("$.[*].adresse").value(hasItem(DEFAULT_ADRESSE)))
            .andExpect(jsonPath("$.[*].telephone").value(hasItem(DEFAULT_TELEPHONE)))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)));
    }
    
    @SuppressWarnings({"unchecked"})
    public void getAllClubsWithEagerRelationshipsIsEnabled() throws Exception {
        when(clubServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restClubMockMvc.perform(get("/api/clubs?eagerload=true"))
            .andExpect(status().isOk());

        verify(clubServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({"unchecked"})
    public void getAllClubsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(clubServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restClubMockMvc.perform(get("/api/clubs?eagerload=true"))
            .andExpect(status().isOk());

        verify(clubServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    public void getClub() throws Exception {
        // Initialize the database
        clubRepository.saveAndFlush(club);

        // Get the club
        restClubMockMvc.perform(get("/api/clubs/{id}", club.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(club.getId().intValue()))
            .andExpect(jsonPath("$.logoContentType").value(DEFAULT_LOGO_CONTENT_TYPE))
            .andExpect(jsonPath("$.logo").value(Base64Utils.encodeToString(DEFAULT_LOGO)))
            .andExpect(jsonPath("$.nom").value(DEFAULT_NOM))
            .andExpect(jsonPath("$.adresse").value(DEFAULT_ADRESSE))
            .andExpect(jsonPath("$.telephone").value(DEFAULT_TELEPHONE))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL));
    }

    @Test
    @Transactional
    public void getNonExistingClub() throws Exception {
        // Get the club
        restClubMockMvc.perform(get("/api/clubs/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateClub() throws Exception {
        // Initialize the database
        clubService.save(club);
        // As the test used the service layer, reset the Elasticsearch mock repository
        reset(mockClubSearchRepository);

        int databaseSizeBeforeUpdate = clubRepository.findAll().size();

        // Update the club
        Club updatedClub = clubRepository.findById(club.getId()).get();
        // Disconnect from session so that the updates on updatedClub are not directly saved in db
        em.detach(updatedClub);
        updatedClub
            .logo(UPDATED_LOGO)
            .logoContentType(UPDATED_LOGO_CONTENT_TYPE)
            .nom(UPDATED_NOM)
            .adresse(UPDATED_ADRESSE)
            .telephone(UPDATED_TELEPHONE)
            .email(UPDATED_EMAIL);

        restClubMockMvc.perform(put("/api/clubs")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedClub)))
            .andExpect(status().isOk());

        // Validate the Club in the database
        List<Club> clubList = clubRepository.findAll();
        assertThat(clubList).hasSize(databaseSizeBeforeUpdate);
        Club testClub = clubList.get(clubList.size() - 1);
        assertThat(testClub.getLogo()).isEqualTo(UPDATED_LOGO);
        assertThat(testClub.getLogoContentType()).isEqualTo(UPDATED_LOGO_CONTENT_TYPE);
        assertThat(testClub.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testClub.getAdresse()).isEqualTo(UPDATED_ADRESSE);
        assertThat(testClub.getTelephone()).isEqualTo(UPDATED_TELEPHONE);
        assertThat(testClub.getEmail()).isEqualTo(UPDATED_EMAIL);

        // Validate the Club in Elasticsearch
        verify(mockClubSearchRepository, times(1)).save(testClub);
    }

    @Test
    @Transactional
    public void updateNonExistingClub() throws Exception {
        int databaseSizeBeforeUpdate = clubRepository.findAll().size();

        // Create the Club

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restClubMockMvc.perform(put("/api/clubs")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(club)))
            .andExpect(status().isBadRequest());

        // Validate the Club in the database
        List<Club> clubList = clubRepository.findAll();
        assertThat(clubList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Club in Elasticsearch
        verify(mockClubSearchRepository, times(0)).save(club);
    }

    @Test
    @Transactional
    public void deleteClub() throws Exception {
        // Initialize the database
        clubService.save(club);

        int databaseSizeBeforeDelete = clubRepository.findAll().size();

        // Delete the club
        restClubMockMvc.perform(delete("/api/clubs/{id}", club.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Club> clubList = clubRepository.findAll();
        assertThat(clubList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Club in Elasticsearch
        verify(mockClubSearchRepository, times(1)).deleteById(club.getId());
    }

    @Test
    @Transactional
    public void searchClub() throws Exception {
        // Initialize the database
        clubService.save(club);
        when(mockClubSearchRepository.search(queryStringQuery("id:" + club.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(club), PageRequest.of(0, 1), 1));
        // Search the club
        restClubMockMvc.perform(get("/api/_search/clubs?query=id:" + club.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(club.getId().intValue())))
            .andExpect(jsonPath("$.[*].logoContentType").value(hasItem(DEFAULT_LOGO_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].logo").value(hasItem(Base64Utils.encodeToString(DEFAULT_LOGO))))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM)))
            .andExpect(jsonPath("$.[*].adresse").value(hasItem(DEFAULT_ADRESSE)))
            .andExpect(jsonPath("$.[*].telephone").value(hasItem(DEFAULT_TELEPHONE)))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)));
    }
}
