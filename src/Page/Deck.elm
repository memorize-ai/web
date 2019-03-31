port module Page.Deck exposing (main)

import Browser
import Html exposing (Html, node, section, article, h1, div, p, figure, button, label, input, div, text, img, strong, p, small, br, i, nav, span)
import Html.Attributes exposing (attribute, src, id, class, alt, placeholder, type_)
import Html.Events exposing (onClick)
import Page.Template as Template

port signOut : () -> Cmd msg
port signedOut : (() -> msg) -> Sub msg
port updateUser : (User -> msg) -> Sub msg
port updateDeck : (Deck -> msg) -> Sub msg

type alias User = { name : String, uid : String }
type alias Deck =
    { count : Int
    , photoUrl : Maybe String
    , name : String
    , description : String
    , creator : String
    , owner : String
    , public : Bool
    }

type alias Model =
    { user : Maybe User
    , deck : Maybe Deck
    , deckId : String
    }

type Msg
    = UpdatedUser User
    | UpdatedDeck Deck
    | SignOut
    | SignedOut

main : Program String Model Msg
main =
    Browser.document
        { init = \deckId -> (Model Nothing Nothing deckId, Cmd.none)
        , view = view
        , update = update
        , subscriptions = subscriptions
        }

loadingOrString : Maybe String -> String
loadingOrString = Maybe.withDefault "Loading..."

loadingOrText : Maybe String -> Html Msg
loadingOrText textMaybe =
    Maybe.withDefault
        (i [] [ text "Loading..." ])
        (Maybe.map text textMaybe)

loadingOrHtml : (a -> Html Msg) -> Maybe a -> Html Msg
loadingOrHtml htmlFunc maybe =
    Maybe.withDefault
        (i [] [ text "Loading..." ])
        (Maybe.map htmlFunc maybe)

view : Model -> Browser.Document Msg
view model =
    { title = loadingOrString (Maybe.map .name model.deck) ++ " Deck - memorize.ai"
    , body =
        Template.viewApp
            [ Template.viewSection (Just "decks") (Just "decks")
                [ div [ class "tile is-ancestor" ]
                    [ div [ class "tile is-parent" ]
                        [ div [ class "tile is-child box" ]
                            [ h1 [ class "title" ] [ loadingOrText (Maybe.map (\deck -> deck.name ++ " Deck") model.deck) ]
                            , loadingOrHtml viewDeck model.deck
                            ]
                        ]
                    , div [ class "tile is-parent is-4" ]
                        [ div [ class "tile is-child box" ]
                            [ h1 [ class "title" ] [ text "Search decks" ]
                            , div [ id "search-input" ] []
                            , div [ id "hits" ] []
                            , div [ id "pagination" ] []
                            -- , node "script" [ attribute "type" "text/html", attribute "id" "hit-template" ]
                            --     [ div [ class "hit" ]
                            --         [ p [ class "hit-name" ]
                            --             [ text "{{#helpers.highlight}}{ \"attribute\": \"firstname\" }{{/helpers.highlight}}"
                            --             , text "{{#helpers.highlight}}{ \"attribute\": \"lastname\" }{{/helpers.highlight}}"
                            --             ]
                            --         ]
                            --     ]
                            ]
                        ]
                    ]
                ]
            ]
            model.user SignOut
    }

viewDeck : Deck -> Html Msg
viewDeck deck =
    div [ class "box" ]
        [ article [ class "media" ]
            [ div [ class "media-left" ]
                [ figure [ class "image is-64x64" ]
                    [ img
                        [ src (Maybe.withDefault "images/infinity.gif" deck.photoUrl)
                        , alt "Image"
                        ] []
                    ]
                ]
            , div [ class "media-content" ]
                [ div [ class "content" ]
                    [ p []
                        [ strong [] [ text deck.name ]
                        , text " "
                        , small [] [ text deck.creator ]
                        , text " "
                        , small [] [ text ( String.fromInt deck.count ) ]
                        ]
                    ]
                ]
            ]
        ]

update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        UpdatedUser user ->
            ( { model | user = Just user }, Cmd.none )
        UpdatedDeck deck ->
            ( { model | deck = Just deck }, Cmd.none )
        SignOut ->
            ( model, signOut () )
        SignedOut ->
            ( { model | user = Nothing }, Cmd.none )
            
subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ updateUser UpdatedUser
        , updateDeck UpdatedDeck
        , signedOut (always SignedOut)
        ]
