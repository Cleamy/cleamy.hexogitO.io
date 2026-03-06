---
title: springAOP思想
date: 2024-05-02 22:57:03
tags:  
    - java
    - springAOP
categories:
    - java
    - AOP
description: 具体内容点击查看
swiper_index: 3
---

### AOP 面向切面
+   aop思想的实现方案
  + 动态代理技术，在运行期间，对目标对象的方法进行增强
  + 代理对象同名方法内可用执行原有逻辑的同时嵌入执行其他增强方法
  + 逻辑或其他对象的方法

![img_2.png](img.png)

##### AOP （Aspect Oriented Programming) 面向切面编程，
+   该编程是对oop编程的一个提升
  + oop是纵向对一个事务的抽象
    + 一个对象包括静态的属性信息，包括动态方法信息
  + aop是横向的对不同事务的抽象，
    + 属性与属性，方法与方法，对象与对象可以组成一个切面

```java
// 代理目标对象实现接口
public interface UserService {
    void said();

    void talk();

}

// 代理的目标对象
@Repository("userService")
public class UserServiceImpl implements UserService {

    @Override
    public void said() {
        System.out.println("said user ");
    }

    @Override
    public void talk() {
        System.out.println("talk user");
    }
}

// 增强类
@Component("myAdvice")
public class MyAdvice {
    public void beforeSaidOrTalk() {
        System.out.println("this is said or talk before method improve");
    }

    public void afterSaidOrTalk() {
        System.out.println("this is said or talk after method improve");
    }
}

// 实现代理目标对象的代理类
@Component
public class MockAopBeanPostProcessor implements BeanPostProcessor, ApplicationContextAware {
    ApplicationContext applicationContext;

    // 在bean初始化之后
    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        // 目标：对UserServiceImpl 的 方法 进行增强
        // 增强的方法为 myAdvice 类 中 的方法
        // 问题：先要进行筛选：service.impl 包下的文件、
        //  如何获取myAdvice：如何从容器中获取myAdvice
        if (bean instanceof UserService) {
            // 使用动态代理方式
            // 返回增强后的 bean对象
            return Proxy.newProxyInstance(
                    bean.getClass().getClassLoader(),
                    bean.getClass().getInterfaces(),
                    (proxy, method, args) -> {
                        // 调用增强方法
                        MyAdvice my = (MyAdvice) applicationContext.getBean(MyAdvice.class);
                        my.beforeSaidOrTalk();
                        // 调用目标方法
                        Object result = method.invoke(bean, args);
                        // 调用增强方法
                        my.afterSaidOrTalk();
                        return result;
                    }
            );
        }
        // 没有返回原值
        return bean;
    }


    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        this.applicationContext = applicationContext;
    }
}
```
#### aop中相关概念
  +   目标对象：target：被增强的方法所在的对象
  +   代理对象：proxy：对目标对象进行增强后的对象，客户端实现调用的对象
  +   连接点：JoinPoint：目标对象中可以被增强的方法
  +   切入点：Pointcut：目标对象实际中实际被增强的方法
  +   通知：advice：增强部分的代码逻辑
  +   切面：aspect：增强和切入点的集合
  +   织入：Weaving：将通知和切入点组合动态组合的过程

### 基于xml配置的aop
1. xml方式aop快速入门
2. xml方式aop配置详解
3. xml方式aop原理解析
#### 配置问题
  + 1、哪些包、哪些类、那些方法需要被增强
  + 2、配置方法要被那些通知所增强，在目标方法执行前还是执行后进行增强
  + 3、基于些问题，进行xml配置
#### xml方式配置
      + 1、使用aop相关坐标（判断类是在那个包下）
      + 2、准备慕白哦类、准备增强类，并配置给Spring管理
      + 3、配置切入点表达式（哪些方法被增强）
      + 4、配置织入的方式（切点被那些通知增强，是前置还是后置）
```xml
<beans>
    <!-- 配置目标类-->
    <bean id="userService" class="com.cleamy.service.impl.UserServiceImpl"/>
    <!-- 配置通知类-->
    <bean id="myAdvice" class="com.cleamy.advice.MyAdvice"/>
    
    <!-- aop 的 配置 -->
    <aop:config>
        <!-- 配置切点表达式 ， 指定最终被增强的方法,可以配置多个切点表达式  -->
        <aop:pointcut id="myPointCut" expression="execution(void com.cleamy.service.impl.UserServiceImpl.said())"/>
        <!-- 配置织入 ，目的 是要指定 哪些切点要与哪些通知进行结合
            aspect : 切面，ref 指定 通知的bean
            before、after ：指定是 前置方法还是后置方法
            pointcut-ref：表示要织入的切点

        -->
        <aop:aspect ref="myAdvice">
            <aop:before method="beforeSaidOrTalk" pointcut-ref="myPointCut"/>
        </aop:aspect>
    </aop:config>
    </beans>

```
##### 切点表达式配置方式   
    + pointcut-ref : 引用外部切点表达式
    + pointcut：直接在些切点表达式
  + 切点表达式配置语法
    + 切点表达式配置要对哪些连接点（哪些类的哪些方法）进行通知的增强
    + execution([访问修改符] 返回值类型 全限定名.方法名(参数))
      + 权限修饰符可以省略不写
      + 返回值类型、某一级包名、类名、方法名 可以使用*表示任意
      + 包名与类名之间使用单点.表示该包下的类，使用双点.. 表示该包下的子包下的类
      + 参数列表可以使用两个点..表示任意参数
##### aspectJ 的通知 由以下五种类型
    + 前置通知：<aop:before>：目标方法执行前
    + 后置通知：<aop:after-returning>：目标方法执行之后执行，目标方法异常时不执行
    + 环绕通知：<aop:around>：目标方法执行前后执行，且目标方法异常时，不执行
    + 异常通知：<aop:after-throwing>：目标方法抛出异常时执行
    + 最终通知：<aop:after>：不管目标方法是否异常都会执行
      + 通知方法被调用时，spring可以为其传递一些必要的参数
      + joinPoint：连接点对象，任何通知都可以使用，可以获取当前目标对象、目标方法
      + ProceedingJointPoint：joinPoint子类对象，主要是在环绕通知中执行proceed(), 进而执行目标方法
      + Throwable：异常对象，使用在异常通知中，需要在(配置文件中支出异常对象名称)
        + <aop:after-throwing method = "通知方法名称" point-ref="目标方法" throwing="参数名称“/>
          + joinPoint对象
            + public void 通知类名称（JointPoint joinPoint）{
            + // 获取目标方法的参数
            + System.out.println(joinPoint.getArgs())
            + // 获取目标对象
            + System.out.println(joinPoint.getTarget())
            + // 获取精确的切点表达式
            + System.out.println(joinPoint.getStaticPart())
##### xml aop配置 两种语法格式
      + 使用<abvisor> 配置切脉你
      + 使用<aspect>配置切面
        + spring 定义了一个advice接口，实现了该接口的类都可以作为通知类出现
        + public interface Advice{} 
        + advisor 是实现 advice 接口类 来确定通知类型：针对类型单一，切面单一
        + aspect 是通过xml 来配置通知类型
    + xml aop 原理 解析
    + aop 底层原理实现的两种方式
  + 基于注解aop基本使用
  + 
  + 
  + 
### 配置aop，其实配置aop主要就是配置通知类中哪个方法（通知类型）对应的切点表达式是什么
      + 使用注解@Aspect 、@Around、需要被spring解析，
      + 所以spring核心，配置文件aspectj的自动代理
      + @Around("execution(ProceedingJointPoint joinPoint)
      + <aop:aspectj-autoproxy/>
    + 前置通知
    + @Before("切点表达式")
    + 后置通知
    + @AfterReturning("切点表达式")
    + 环绕通知
    + @Around("切点表达式")
    + 异常通知
    + @AfterThrowing(pointcut="切点表达式",throwing="异常形参名称")
    + 最终通知
    + @After("切点表达式")

```Java
import org.aspectj.lang.annotation.Around;

@Component("myAdvice1")
@Aspect // 定义该类为切面
public class MyAdvice3 implements Advice {
    // 切点表达式 的 抽取
    @Pointcut(value = "execution(* com.cleamy.service.impl.UserServiceImpl.said(..))")
    public void myPointcut() {
    }
    
    // 代替<aop:before > 标签
    @Before("execution(* com.cleamy.service.impl.UserServiceImpl.said(..))")
    public void beforeSaidOrTalk() {
        System.out.println("this is said or talk anno before method improve");
    }

    // 代替<aop:afterReturning> 标签
    @AfterReturning("execution(* com.cleamy.service.impl.UserServiceImpl.said(..))")
    public void afterSaidOrTalk() {
        System.out.println("this is said or talk anno after method improve");
    }

    // 代替<aop:afterThrowing> 标签
    @AfterThrowing(pointcut = "execution(* com.cleamy.service.impl.UserServiceImpl.said(..))", throwing = "e")
    public void afterSaidOrTalk(Throwable e) {
        System.out.println("this is said or talk anno after method improve");
    }

    // 代替<aop:around> 标签
    @Around("execution(* com.cleamy.service.impl.UserServiceImpl.said(..))")
    public void afterSaidOrTalk() throws Throwable {
        System.out.println("this is said or talk anno after method improve");
    }

    // 引用外部的 切点表达式
    @Around("MyAdvice3.myPointcut()")
    public Object aroundSaidOrTalk(ProceedingJoinPoint proceedingJoinPoint) throws Throwable {
        System.out.println("around before");
        Object  res = proceedingJoinPoint.proceed();
        System.out.println("around after");
        return res;
    }
}
```

### 解析aop xml 和注解 aspectJ-autoProxy 的底层原理

#### aop 的 声明式事务控制
	+ spring 事务编程的概述
	+ 搭建测试环境
	+ 基于xml声明式事务控制
	+ 基于注解声明式事务控制

	+	spring事务分为：编成式事务控制 和 声明式事务控制
		+	编程式事务控制：spring提供了事务控制的类和方法，
			+	使用编码的方式对业务代码进行事务控制，事务控制代码和业务操作代码耦合到一起，开发中不使用
		+	声明式事务控制：spring1将事务控制代码封装，对外提供了xml和注解配置方式
				+	通过配置的方式完成事务的控制
				+	可以达到事务控制与业务代码解耦合，推荐使用	
		+	spring 事务编程相关的类主要由如下三个
			+	平台事务管理器（PlatformTransactionManager）：这是一个接口标准、规范，内部提供了要\</br>实现的事务提交、回滚和获得事务对象的能力、作用于持久层框架
			+	事务定义（TransactionDefinition）：封装事务的隔离级别、传播行为、过期时间等属性信息
			+	事务状态（transactionStatus）：存储当前事务的状态信息，如果事务是否提交，是否回滚，是否由回滚点等
		+ isolation	
			