package fr.district.codemax;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.core.importer.ImportOption;
import org.junit.jupiter.api.Test;

class ArchTest {

    @Test
    void servicesAndRepositoriesShouldNotDependOnWebLayer() {
        JavaClasses importedClasses = new ClassFileImporter()
            .withImportOption(ImportOption.Predefined.DO_NOT_INCLUDE_TESTS)
            .importPackages("fr.district.codemax");

        noClasses()
            .that()
            .resideInAnyPackage("fr.district.codemax.service..")
            .or()
            .resideInAnyPackage("fr.district.codemax.repository..")
            .should()
            .dependOnClassesThat()
            .resideInAnyPackage("..fr.district.codemax.web..")
            .because("Services and repositories should not depend on web layer")
            .check(importedClasses);
    }
}
