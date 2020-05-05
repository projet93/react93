package fr.district.codemax.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import fr.district.codemax.web.rest.TestUtil;

public class PlateauTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Plateau.class);
        Plateau plateau1 = new Plateau();
        plateau1.setId(1L);
        Plateau plateau2 = new Plateau();
        plateau2.setId(plateau1.getId());
        assertThat(plateau1).isEqualTo(plateau2);
        plateau2.setId(2L);
        assertThat(plateau1).isNotEqualTo(plateau2);
        plateau1.setId(null);
        assertThat(plateau1).isNotEqualTo(plateau2);
    }
}
