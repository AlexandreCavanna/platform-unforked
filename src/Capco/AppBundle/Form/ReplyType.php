<?php

namespace Capco\AppBundle\Form;

use Capco\AppBundle\Form\DataTransformer\EntityToIdTransformer;
use Capco\AppBundle\Toggle\Manager;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ReplyType extends AbstractType
{
    protected $transformer;
    protected $toggleManager;

    public function __construct(EntityToIdTransformer $transformer, Manager $toggleManager)
    {
        $this->transformer = $transformer;
        $this->toggleManager = $toggleManager;
    }

    /**
     * @param FormBuilderInterface $builder
     * @param array                $options
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('responses', CollectionType::class, [
                'allow_add' => true,
                'allow_delete' => false,
                'by_reference' => false,
                'type' => ValueResponseType::class,
                'required' => false,
            ])
        ;

        if ($options['anonymousAllowed']) {
            $builder
                ->add('private', null, [
                    'required' => false,
                ])
            ;
        }
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => 'Capco\AppBundle\Entity\Reply',
            'csrf_protection' => false,
            'cascade_validation' => true,
            'anonymousAllowed' => false,
        ]);
    }
}
