package fr.district.codemax.repository.search;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;

/**
 * Configure a Mock version of {@link ReferentSearchRepository} to test the
 * application without starting Elasticsearch.
 */
@Configuration
public class ReferentSearchRepositoryMockConfiguration {

    @MockBean
    private ReferentSearchRepository mockReferentSearchRepository;

}
