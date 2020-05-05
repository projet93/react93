package fr.district.codemax.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import fr.district.codemax.web.rest.TestUtil;

public class ClubTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Club.class);
        Club club1 = new Club();
        club1.setId(1L);
        Club club2 = new Club();
        club2.setId(club1.getId());
        assertThat(club1).isEqualTo(club2);
        club2.setId(2L);
        assertThat(club1).isNotEqualTo(club2);
        club1.setId(null);
        assertThat(club1).isNotEqualTo(club2);
    }
}
