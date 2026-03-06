---
title: spring 知识2
date: 2024-05-02 22:57:03
tags:  
    - java
    - spring
categories:
    - java
    - spring
description: 具体内容点击查看
swiper_index: 3
---
### 基于注解的spring应用

<bean> 标签的机泵属性
<bean id="" name="" class="" scope=""   lazy-init=""
init-method="" destroy-method="" abstract="" autowire=""
factory-bean="" factory-method=""/>

+ id ： 为 BeanName
+ name： 为 别名
+ class：为 实例类型
+ scope：bean的作用范围
+ lazy-init：懒加载方法
+ init-method：初始化方法
+ destroy-method：销毁方法
+ abstract：是否为抽象
+ autowire：自动注入
+ factory-bean：beanFactory 实例bean
+ factory-method：bean中实例化方法

####  Bean基于注解开发
+ 基本Bean 注解，主要使用注解的方式代替原有的xml<bean> 标签
+ 使用component 注解代替bean 标签
+ 通过使用@Component(value="beanName"); 设置bean和 
+ 同时 如果value没有值，默认为类名且首字母小写

```java
import org.springframework.context.annotation.Lazy;
import org.springframework.context.annotation.Scope;

// xml 原理
//<bean id="userDao" class="com.cleamy.dao.impl.UserDaoImpl"/>
// 基于注解实现bean 的实例
//@Component(value = "userDao")
// 由于 component 注解内的属性只有一个 ，且名字是value
// 所以可用直接将value 省略
@Component("userDao")
@Scope("singleton")
@Lazy(true)
public class UserDaoImpl implements UserDao {
    public UserDaoImpl(){
        System.out.println("bean create");
    }
    
    @PostConstruct
    public void  init(){
        System.out.println("init method");
    }
    
    @PostDestroy
    public  void destroy(){
        System.out.println("destroy method");
    }
}

```
  + 使用@Scope代替 原有的 scope 属性
  + 使用Lazy 代替 原有 lazy-init
  + 使用@PostConstruct 替代 init方法
  + 使用@PostDestroy 替代 destroy方法
+ @Component 衍生注解
  + @Repository（仓库）：在dao层上使用
  + @Service：在service层上使用
  + @Controller ： 在web层上使用

```java
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Service;

@Repository("userDao")
class UserDaoImpl implements userDao {
}

@Service("userService")
class UserService implements UserService {
}

@Controller("userService")
class UserController{}
```

# 属性注入注解
  + @value : 使用在字段或方法行，用于注入普通数据 
  + @Autowired： 使用在字段或方法上，更具类型Type 注入引用数据
  + @Qualifier：使用在字段或方法，结合@Autowire，根据名称进行注入
  + @ResourceL：使用在字段或方法上，更具类型或名称进行注入
    + @Autowire  根据类型进行注入，如果同种类型的bean有多个，
      + 尝试根据名字进行二次匹配、匹配不成功后，通过类名进行匹配，若都不成功，则返回异常
    + @Qualifier("BeanName")：通过beanName进行匹配，一般情况下与autoWire进行使用
    + Resource() // 在不指定名称参数的情况下，更具类型进行注入，指定名称就更具名称进行注入

```java
@Component("testDao")
public class TestUserDao {
    @Value("eqauloName")
    private String username;
    @Value("${jdbc.driver}")
    private  Integer intId;
    // 自动根据类型注入 
    @Autorwire 
    private UserDao userDao;
    
    public void testMethod(){
        
    }
}
```
+ autowired扩展
  + 除了用于属性的注入还可以用于，类内方法参数的注入


+ 非自定义bean的注解开发（别人开发的jar包）
  + 通过@Bean注解进行
  + 非定义bean需要通过工厂实例化进行，
  + 使用方法所在的类必须使用@component 注解
  + @Bean的属性为beanName(若BeanName没有指定名字则默认使用方法名)
```java
@Component
public class OtherBean {
    // 对参数值进行注入
    // 普通数据类型：value 注解
    // 注入应用数据类型：Autowire 、Qualifier、Resource注解
    @Bean("dataSource")
    public DataSource dataSource(@Value("${jdbc.driver}")String driver,
                                 @Autowired UserDao userDao,
                                @Qualifier("userDao2") UserDao userDao2){
        DruidDataSource dataSource =new DruidDataSource();
        // 设置四个基本参数
        return dataSource;

    }
}
```
##### 配置类的注解开发
+ @Component 等注解 代替了 <bean> 标签，但是xml配置文件仍然有一些标签要怎么样使用注解去代替 
  + 配置类是，使用注解代替 bean标签以外的 
```java
/*
 * @Configuration： 标注但钱类是一个配置文件 + 标注@Component
 * @ComponentScan： 注解组件扫描扫描的基本包极其子包下的类，相当于component-scan 标签
 * @PropertySource(）：相当于是property-placeholder 标签 用于配置文件的加载,多个文件时，使用数组的形
 * @Import() ；用于加载其他配置类，相当于时<import resource=""/>       
 * */
@Configuration
@ComponentScan("com.cleamy")
@PropertySource({"classpath:jdbc.properties",""})
@Import(OtherBean.class)
public class SpringConfig {
}
// 使用 注解的方式进行导入配置类 
AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(SpringConfig.class);

```
##### spring 中其他注解
+ @Primary 注解用于标注相同类型的bean邮箱被使用权，
  + @Primary 是 spring 3.0 引入的
  + 与@Component 和 @Bean一起使用，标注该Bean的优先级更高，
  + 在通过Bean或Autowired注入时 ，优先选择
  +

```java
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Repository;

@Repository("userDao1")
public class UserDaoImpl1 implements UserDao {
}

// 优先选择 2
@Repository("userDao2")
@Primary
public class UserDaoImpl2 implements UserDao {
}

// 优先选择 2
@Bean
public UserDao UserDao1() {return new UserDaoIMpl1();}

@Bean
@Primary 
public UserDao userDao2() {return new com.cleamy.dao.impl.UserDaoImpl2();}
```
+ @profile 注解 用于 环境切换
  + <bean profile='test">
  + 注解@Profile 标注在类或方法上，标注当前产生的Bean从属于那个环境，
  + 只有激活了当前环境，被标注的bean才能注入到spring容器中
  + 可用一下两种方式指定被激活的环境
    + 使用命令动态参数，虚拟机参数位置加载 -Dspring.profile.active=test
    + 使用代码的方式设置环境变量 System.setProperty("spring.profile.active","test")

```java
import com.cleamy.dao.UserDao;
import org.springframework.stereotype.Repository;

@Repository("userDao")
@Profile("test")
public class UserDaoImpl implements UserDao{}

@Repository("userDao2")
public class UserDaoImpl2 implements UserDao{}
```
#### spring 注解的解析原理


#### spring 注解方式整合第三方框架
+ 使用注解的形式进行mybatis的整合
```java
@Configuration // 注明配置类
@ComponentScan("com.cleamy") // 注明主件扫描
@PropertySource("classpath:jdbc.properties") // 注明 properties 文件路径
@MapperScan("com.cleamy.mapper") // 注明mapper包扫描
public class SpringConfig {
    
    // 相当于<bean id="dataSource" class="com.XXXX.DataSouce">XXXXX</bean>
    // 使用 注解的形式代替原有的xml bean标签
    @Bean
    public DataSource dataSource(
            @Value("${jdbc.driver}") String driver,
            @Value("${jdbc.url}") String url,
            @Value("${jdbc.username}") String username,
            @Value("${jdbc.password}") String password
            ){
        DruidDataSource dataSource = new DruidDataSource();
        dataSource.setDriverClassName(driver);
        dataSource.setUrl(url);
        dataSource.setUsername(username);
        dataSource.setPassword(password);
        return dataSource;
    }

    //  这里的 dataSource 使用 autowired自动注入
    // 相当于是<bean class="com.XXX.sqlSessionFactoryBean" > <property name="dataSource" ref="dataSource"></bean>
    @Bean
    public SqlSessionFactoryBean sqlSessionFactoryBean (DataSource dataSource){
        SqlSessionFactoryBean   sqlSessionFactoryBean = new SqlSessionFactoryBean();
        sqlSessionFactoryBean.setDataSource(dataSource);
        return sqlSessionFactoryBean;
    }
}
```
+ import 注解
  + import 整合第三方框架
  + @import 可用爆乳如下三种类：
    + 普通的配置类
    + 实现importSelector接口的类
    + 实现importBeanDefinitionRegistrar接口的类